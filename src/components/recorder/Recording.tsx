'use client';

import type { Recording } from '@/lib/db/db';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Pin, PinOff, Save, Trash2 } from 'lucide-react';
import {
  downloadTextContent,
  sanitizeFileNamePart,
  transcriptToEstimatedSrt,
} from '@/lib/transcriptExport';
import RecordingHeader from './RecordingHeader';
import RecordingTranscriptEditor from './RecordingTranscriptEditor';

interface RecordingProps {
  recording: Recording;
  onDelete: (id: string) => Promise<void>;
  onMarkPending: (id: string) => Promise<void>;
  onMarkSynced: (id: string) => Promise<void>;
  onMarkFailed: (id: string) => Promise<void>;
  onTogglePinned: (id: string) => Promise<void>;
  saveTranscript: (
    id: string,
    transcript: string,
    label?: string
  ) => Promise<void>;
}

export default function Recording({
  recording,
  onDelete,
  onMarkPending,
  onMarkSynced,
  onMarkFailed,
  onTogglePinned,
  saveTranscript,
}: RecordingProps) {
  const [transcript, setTranscript] = useState(recording.transcript);
  const [label, setLabel] = useState(recording.label);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusAction, setStatusAction] = useState<
    'pending' | 'synced' | 'failed' | 'pin' | null
  >(null);
  const [saveState, setSaveState] = useState<'idle' | 'dirty' | 'saved'>(
    'idle'
  );

  const audioUrl = useMemo(() => {
    return URL.createObjectURL(recording.audioBlob);
  }, [recording.audioBlob]);

  const formattedCreatedAt = useMemo(
    () =>
      new Date(recording.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [recording.createdAt]
  );

  const isDirty = useMemo(
    () => transcript !== recording.transcript || label !== recording.label,
    [label, recording.label, recording.transcript, transcript]
  );

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    setTranscript(recording.transcript);
    setLabel(recording.label);
    setSaveState('idle');
  }, [recording.id, recording.label, recording.transcript]);

  useEffect(() => {
    setSaveState(isDirty ? 'dirty' : 'idle');
  }, [isDirty]);

  const router = useRouter();

  const deleteRecordingHandler = useCallback(async () => {
    if (!confirm('Are you sure you want to delete this recording?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(recording.id);
      router.push('/');
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete, recording.id, router]);

  const saveTranscriptHandler = useCallback(async () => {
    if (!isDirty || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      await saveTranscript(recording.id, transcript, label);
      setSaveState('saved');
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, isSaving, label, recording.id, saveTranscript, transcript]);

  useEffect(() => {
    const handleSaveShortcut = (event: KeyboardEvent) => {
      const isModifierPressed = event.metaKey || event.ctrlKey;
      if (isModifierPressed && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void saveTranscriptHandler();
      }
    };

    window.addEventListener('keydown', handleSaveShortcut);
    return () => window.removeEventListener('keydown', handleSaveShortcut);
  }, [saveTranscriptHandler]);

  const exportFileBaseName = useMemo(() => {
    const safeLabel = sanitizeFileNamePart(label || recording.label);
    const datePart = new Date(recording.createdAt).toISOString().slice(0, 10);
    return `${safeLabel}-${datePart}`;
  }, [label, recording.createdAt, recording.label]);

  const exportAsTxt = useCallback(() => {
    const content = transcript.trim() || 'No transcript available.';
    downloadTextContent(content, `${exportFileBaseName}.txt`, 'text/plain');
  }, [exportFileBaseName, transcript]);

  const exportAsSrt = useCallback(() => {
    const content = transcript.trim();
    const srt = content
      ? transcriptToEstimatedSrt(content)
      : '1\n00:00:00,000 --> 00:00:02,000\nNo transcript available.';

    downloadTextContent(srt, `${exportFileBaseName}.srt`, 'text/plain');
  }, [exportFileBaseName, transcript]);

  return (
    <div className="border-main grid w-full gap-4 rounded-2xl border bg-white p-4 shadow-sm md:p-6">
      <RecordingHeader
        recording={recording}
        label={label}
        onLabelChange={setLabel}
        formattedCreatedAt={formattedCreatedAt}
      />

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
        <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">
          Recording preview
        </p>
        <audio
          src={audioUrl}
          controls
          className="h-10 w-full"
          preload="metadata"
        />
      </div>

      <RecordingTranscriptEditor
        transcript={transcript}
        onTranscriptChange={setTranscript}
        isSaving={isSaving}
        saveState={saveState}
      />

      <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-3">
        <Button
          size="small"
          onClick={saveTranscriptHandler}
          disabled={!isDirty || isSaving}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        <Button
          variant="secondary"
          size="small"
          onClick={exportAsTxt}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export TXT
        </Button>

        <Button
          variant="secondary"
          size="small"
          onClick={exportAsSrt}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export SRT
        </Button>

        <Button
          variant="secondary"
          onClick={async () => {
            setStatusAction('pin');
            try {
              await onTogglePinned(recording.id);
            } finally {
              setStatusAction(null);
            }
          }}
          disabled={statusAction !== null}
          className="flex items-center gap-2"
        >
          {recording.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          {recording.isPinned ? 'Unpin' : 'Pin'}
        </Button>

        <Button
          onClick={async () => {
            setStatusAction('pending');
            try {
              await onMarkPending(recording.id);
            } finally {
              setStatusAction(null);
            }
          }}
          disabled={recording.syncStatus === 'pending' || statusAction !== null}
        >
          Mark as Pending
        </Button>

        <Button
          onClick={async () => {
            setStatusAction('synced');
            try {
              await onMarkSynced(recording.id);
            } finally {
              setStatusAction(null);
            }
          }}
          disabled={recording.syncStatus === 'synced' || statusAction !== null}
        >
          Mark as Synced
        </Button>

        <Button
          onClick={async () => {
            setStatusAction('failed');
            try {
              await onMarkFailed(recording.id);
            } finally {
              setStatusAction(null);
            }
          }}
          disabled={recording.syncStatus === 'failed' || statusAction !== null}
        >
          Mark as Failed
        </Button>

        <button
          aria-label="Clear"
          onClick={deleteRecordingHandler}
          disabled={isDeleting}
          className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50"
        >
          <Trash2 size={25} />
        </button>
      </div>
    </div>
  );
}
