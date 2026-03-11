'use client';

import type { Recording } from '@/lib/db/db';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

interface RecordingProps {
  recording: Recording;
  onDelete: (id: string) => Promise<void>;
  onMarkPending: (id: string) => Promise<void>;
  onMarkSynced: (id: string) => Promise<void>;
  onMarkFailed: (id: string) => Promise<void>;
}

export default function Recording({
  recording,
  onDelete,
  onMarkPending,
  onMarkSynced,
  onMarkFailed,
}: RecordingProps) {
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

  return (
    <div className="border-main grid w-full gap-4 rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-3xl font-semibold">{recording.label}</h2>
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
        <p className="rounded-md bg-gray-100 p-2">{recording.transcript}</p>
      </div>

      <div className="flex gap-2">
        <Button size="small">Edit</Button>

        <Button
          size="small"
          onClick={() => onMarkPending(recording.id)}
          disabled={recording.syncStatus === 'pending'}
        >
          Mark as Pending
        </Button>

        <Button
          size="small"
          onClick={() => onMarkSynced(recording.id)}
          disabled={recording.syncStatus === 'synced'}
        >
          Mark as Synced
        </Button>

        <Button
          size="small"
          onClick={() => onMarkFailed(recording.id)}
          disabled={recording.syncStatus === 'failed'}
        >
          Mark as Failed
        </Button>

        <Button
          size="small"
          className="bg-red-700"
          onClick={deleteRecordingHandler}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
