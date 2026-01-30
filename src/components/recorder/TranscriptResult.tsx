'use client';

import { Copy, Check, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';

interface Props {
  text: string;
  isProcessing: boolean;
  onClear: () => void;
}

export default function TranscriptResult({
  isProcessing,
  text,
  onClear,
}: Props) {
  const [copied, setCopied] = useState(false);
  const transcript = useRef<HTMLTextAreaElement>(null);
  const [editableText, setEditableText] = useState(text);

  async function handleCopy() {
    if (transcript.current) {
      try {
        await navigator.clipboard.writeText(transcript.current.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.log('Failed to copy test: ', err);
      }
    }
  }

  return (
    <div className="mt-6 w-full">
      <div className="mb-2 flex items-center justify-between">
        {!isProcessing && (
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleCopy}
              className="rounded-md p-2 transition-colors hover:bg-gray-100"
            >
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
            <button
              onClick={onClear}
              className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          ref={transcript}
          value={
            isProcessing
              ? 'Please wait while I translate your voice to text...'
              : editableText
          }
          onChange={(e) => setEditableText(e.target.value)}
          disabled={isProcessing}
          className={`min-h-38 w-full rounded-xl border p-4 transition-all outline-none ${isProcessing ? 'animate-pulse border-gray-200 bg-gray-50 text-gray-400' : 'border-gray-400 bg-white shadow-sm focus:border-gray-600'} `}
        />
      </div>
    </div>
  );
}
