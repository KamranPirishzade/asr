'use client';

import type { Recording } from '@/lib/db/db';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface RecordingProps {
  recording: Recording;
  onDelete: (id: string) => Promise<void>;
  onMarkPending: (id: string) => Promise<void>;
  onMarkSynced: (id: string) => Promise<void>;
  onMarkFailed: (id: string) => Promise<void>;
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
  saveTranscript,
}: RecordingProps) {
  const [transcript, setTranscript] = useState(recording.transcript);
  const [label, setLabel] = useState(recording.label);

  const url = useMemo(() => {
    return URL.createObjectURL(recording.audioBlob);
  }, [recording.audioBlob]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);

  const router = useRouter();

  const deleteRecordingHandler = async () => {
    if (confirm('Are you sure you want to delete this recording?')) {
      await onDelete(recording.id);
      router.push('/');
    }
  };

  const saveTranscriptHandler = async () => {
    await saveTranscript(recording.id, transcript, label);
  };

  return (
    <div className="border-main grid w-full gap-4 rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="mb-2 text-sm text-gray-500">Label:</p>
          <input
            className="w-full border-b border-gray-500 pb-1 text-3xl font-semibold outline-none"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="">
          Status:{' '}
          <span
            className={cn('rounded-md p-1 uppercase', {
              'bg-orange-400': recording.syncStatus === 'pending',
              'bg-green-400': recording.syncStatus === 'synced',
              'bg-red-400': recording.syncStatus === 'failed',
            })}
          >
            {recording.syncStatus}
          </span>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-gray-500">Recording:</p>
        <audio src={url} controls className="h-10 w-full" />
      </div>

      <div>
        <p className="mb-2 text-sm text-gray-500">Transcript:</p>
        <textarea
          className="focus:outline-secondary w-full resize-none rounded-md bg-gray-100 p-2 outline-0 transition-all duration-300 focus:ring-1"
          rows={4}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        ></textarea>
      </div>

      <div className="flex gap-2">
        <Button size="small" onClick={saveTranscriptHandler}>
          Save
        </Button>

        <Button
          onClick={() => onMarkPending(recording.id)}
          disabled={recording.syncStatus === 'pending'}
        >
          Mark as Pending
        </Button>

        <Button
          onClick={() => onMarkSynced(recording.id)}
          disabled={recording.syncStatus === 'synced'}
        >
          Mark as Synced
        </Button>

        <Button
          onClick={() => onMarkFailed(recording.id)}
          disabled={recording.syncStatus === 'failed'}
        >
          Mark as Failed
        </Button>

        <button
          aria-label="Clear"
          onClick={deleteRecordingHandler}
          className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50"
        >
          <Trash2 size={25} />
        </button>
      </div>
    </div>
  );
}
