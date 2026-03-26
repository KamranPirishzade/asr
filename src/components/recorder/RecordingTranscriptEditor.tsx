'use client';

import { cn } from '@/lib/utils';

interface RecordingTranscriptEditorProps {
  transcript: string;
  onTranscriptChange: (value: string) => void;
  isSaving: boolean;
  saveState: 'idle' | 'dirty' | 'saved';
}

export default function RecordingTranscriptEditor({
  transcript,
  onTranscriptChange,
  isSaving,
  saveState,
}: RecordingTranscriptEditorProps) {
  const saveStateLabel =
    saveState === 'saved'
      ? 'Saved'
      : saveState === 'dirty'
        ? 'Unsaved changes'
        : 'Up to date';

  return (
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
        onChange={(e) => onTranscriptChange(e.target.value)}
      ></textarea>
      <p className="mt-1 text-right text-xs text-gray-400">
        {transcript.length} characters
      </p>
    </div>
  );
}
