'use client';

import { Copy, Check, SkipBack, SendHorizonal } from 'lucide-react';
import { useState, useRef } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useRecordingsContext } from '@/providers/RecordingsContext';

interface Props {
  text: string;
  blob: Blob;
}

export default function Transcript({ text, blob }: Props) {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const transcript = useRef<HTMLTextAreaElement>(null);
  const [editableText, setEditableText] = useState('');
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

  async function handleSave() {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      await saveRecording(
        blob,
        editableText,
        labelRef.current?.value,
        'manual'
      );
      await refresh();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mt-6 w-full rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs tracking-wide text-gray-500 uppercase">
          Manual transcript editor
        </p>
        <span className="text-xs text-gray-500">
          {editableText.length} chars
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-end gap-2">
        <div className="mr-auto flex min-w-60 flex-1 items-center gap-2">
          <span className="text-sm text-gray-600">Label</span>
          <Input type="text" className="w-full" scale="small" ref={labelRef} />
          <Button
            onClick={handleSave}
            size="small"
            disabled={isSaving || editableText.trim().length === 0}
            className="flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save'}{' '}
            <SendHorizonal size={16} />
          </Button>
        </div>

        <button
          onClick={() => setEditableText(text)}
          className="group relative rounded-md p-2 transition-colors hover:bg-gray-100"
          aria-label="Reset transcript"
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
      </div>

      <div className="relative">
        <textarea
          ref={transcript}
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className="focus:ring-secondary min-h-38 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm ring-0 transition-all duration-300 outline-none focus:ring"
        />
      </div>
    </div>
  );
}
