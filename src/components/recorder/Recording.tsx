import type { Recording } from '@/lib/db/db';
import { cn } from '@/lib/utils';

export default function Recording({ recording }: { recording: Recording }) {
  const url = URL.createObjectURL(recording.audioBlob);

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
    </div>
  );
}
