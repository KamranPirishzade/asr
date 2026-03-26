'use client';

import type { Recording } from '@/lib/db/db';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface RecordingHeaderProps {
  recording: Recording;
  label: string;
  onLabelChange: (value: string) => void;
  formattedCreatedAt: string;
}

export default function RecordingHeader({
  recording,
  label,
  onLabelChange,
  formattedCreatedAt,
}: RecordingHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="min-w-60 flex-1">
        <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">
          Label
        </p>
        <input
          className="w-full border-b border-gray-500 pb-1 text-2xl font-semibold outline-none md:text-3xl"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700">
            <Calendar size={13} className="text-gray-500" />
            {formattedCreatedAt}
          </span>

          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase',
              {
                'bg-blue-100 text-blue-700': recording.recordingType === 'auto',
                'bg-violet-100 text-violet-700':
                  recording.recordingType === 'manual',
              }
            )}
          >
            Type: {recording.recordingType}
          </span>

          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase',
              {
                'bg-orange-100 text-orange-700':
                  recording.syncStatus === 'pending',
                'bg-emerald-100 text-emerald-700':
                  recording.syncStatus === 'synced',
                'bg-red-100 text-red-700': recording.syncStatus === 'failed',
              }
            )}
          >
            Status: {recording.syncStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
