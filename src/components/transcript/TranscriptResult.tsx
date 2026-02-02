'use client';

import { Copy, Check, Trash2, SkipBack, SendHorizonal } from 'lucide-react';
import { useState, useRef } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useRecordingsContext } from '@/providers/RecordingsContext';

interface Props {
  text: string;
  isProcessing: boolean;
  onClear: () => void;
  start: () => void;
  blob: Blob;
}

export default function TranscriptResult({
  isProcessing,
  text,
  onClear,
  blob,
}: Props) {
  const [copied, setCopied] = useState(false);
  const transcript = useRef<HTMLTextAreaElement>(null);
  const [editableText, setEditableText] = useState(text);
  const { saveRecording, refresh } = useRecordingsContext();
  const labelRef = useRef<HTMLInputElement | null>(null);

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

  function handleSave() {
    saveRecording(blob, editableText, labelRef.current?.value);
    refresh();
  }

  return (
    <div className="mt-6 w-full">
      <div className="mb-2 flex items-center justify-between">
        {!isProcessing && (
          <div className="flex w-full items-end justify-end gap-2">
            <div className="mr-auto flex flex-1 place-items-center gap-2">
              Label:
              <Input
                type="text"
                className="w-full"
                scale="small"
                ref={labelRef}
              />
              <Button
                onClick={handleSave}
                size="small"
                className="flex items-center gap-2"
              >
                Send <SendHorizonal size={16} />
              </Button>
            </div>

            <button
              onClick={() => setEditableText(text)}
              className="group relative rounded-md p-2 transition-colors hover:bg-gray-100"
            >
              <SkipBack size={16} />
            </button>
            <button
              aria-label="Copy"
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
              aria-label="Clear"
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
          className={`min-h-38 w-full rounded-xl border-0 p-4 ring ring-gray-300 transition-all duration-300 outline-none ${isProcessing ? 'animate-pulse bg-gray-50 text-gray-400' : 'focus:ring-secondary border-gray-400 bg-white shadow-sm focus:ring'} `}
        />
      </div>
    </div>
  );
}
