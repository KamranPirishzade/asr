'use client';

import type { Recording } from '@/lib/db/db';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Pin, PinOff, Save, Trash2 } from 'lucide-react';

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

  const url = useMemo(() => {
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
      URL.revokeObjectURL(url);
    };
  }, [url]);

  useEffect(() => {
    setTranscript(recording.transcript);
    setLabel(recording.label);
    setSaveState('idle');
  }, [recording.id, recording.label, recording.transcript]);

  useEffect(() => {
    setSaveState(isDirty ? 'dirty' : 'idle');
  }, [isDirty]);

  const router = useRouter();

  const deleteRecordingHandler = async () => {
    if (confirm('Are you sure you want to delete this recording?')) {
      setIsDeleting(true);
      try {
        await onDelete(recording.id);
        router.push('/');
      } finally {
        setIsDeleting(false);
      }
    }
  };

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

  const saveStateLabel =
    saveState === 'saved'
      ? 'Saved'
      : saveState === 'dirty'
        ? 'Unsaved changes'
        : 'Up to date';

  return (
    <div className="border-main grid w-full gap-4 rounded-2xl border bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-60 flex-1">
          <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">
            Label
          </p>
          <input
            className="w-full border-b border-gray-500 pb-1 text-2xl font-semibold outline-none md:text-3xl"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
            <Calendar size={14} />
            <span>{formattedCreatedAt}</span>
          </div>

          <span className="text-xs text-gray-500">Sync status</span>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold uppercase',
              {
                'bg-orange-100 text-orange-700':
                  recording.syncStatus === 'pending',
                'bg-emerald-100 text-emerald-700':
                  recording.syncStatus === 'synced',
                'bg-red-100 text-red-700': recording.syncStatus === 'failed',
              }
            )}
          >
            {recording.syncStatus}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
        <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">
          Recording preview
        </p>
        <audio src={url} controls className="h-10 w-full" preload="metadata" />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs tracking-wide text-gray-500 uppercase">
            Transcript
          </p>
          <span
            className={cn('text-xs font-medium', {
              'text-emerald-700': saveState === 'saved',
              'text-amber-700': saveState === 'dirty',
              'text-gray-500': saveState === 'idle',
            })}
          >
            {isSaving ? 'Saving...' : saveStateLabel}
          </span>
        </div>
        <textarea
          className="focus:outline-secondary w-full resize-none rounded-md bg-gray-100 p-3 outline-0 transition-all duration-300 focus:ring-1"
          rows={6}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        ></textarea>
        <p className="mt-1 text-right text-xs text-gray-400">
          {transcript.length} characters
        </p>
      </div>

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
