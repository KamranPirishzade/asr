'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTranscriber } from '@/hooks/useTranscriber';
import Transcript from '../transcript/Transcript';

export default function ManualRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob>();
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const { start } = useTranscriber();

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!isRecording) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setRecordedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

  const formattedTime = `${Math.floor(recordedSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(recordedSeconds % 60).toString().padStart(2, '0')}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setRecordedSeconds(0);
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setIsRecording(true);

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        setBlob(audioBlob);
        setAudioUrl((prevUrl) => {
          if (prevUrl) {
            URL.revokeObjectURL(prevUrl);
          }
          return url;
        });
        start(audioBuffer);
        audioChunks.current = [];

        stream.getTracks().forEach((track) => track.stop());
      };
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          alert('Please enable the mic');
        }
      }
    }
  };
  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const clearRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setBlob(undefined);
    setRecordedSeconds(0);
  };

  return (
    <div className="w-full rounded-2xl border border-gray-300 bg-white p-5 shadow-lg">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <p className="text-xs tracking-wide text-gray-500 uppercase">
            Manual Transcribe
          </p>
          <h2 className="text-xl font-semibold text-gray-900">
            Record first, edit transcript manually
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
              isRecording
                ? 'bg-red-100 text-red-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isRecording ? 'animate-pulse bg-red-500' : 'bg-emerald-500'
              }`}
            />
            {isRecording ? 'Recording' : 'Ready'}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {formattedTime}
          </span>
        </div>
      </div>

      <div className="mb-4 grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
        <div className="flex flex-wrap items-center gap-3">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="flex h-12 items-center gap-2 rounded-full px-5"
            >
              <Mic size={18} />
              Start recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="secondary"
              className="flex h-12 items-center gap-2 rounded-full border-red-500 text-red-500"
            >
              <Square size={16} />
              Stop recording
            </Button>
          )}

          <button
            type="button"
            onClick={clearRecording}
            disabled={!audioUrl}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-red-200 px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:pointer-events-none disabled:opacity-50"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>

        {audioUrl && (
          <div className="w-full">
            <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase">
              Latest recording preview
            </p>
            <audio
              src={audioUrl}
              controls
              className="h-10 w-full"
              preload="metadata"
            />
          </div>
        )}
      </div>

      {!audioUrl ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
          Start recording to open the manual transcript editor.
        </div>
      ) : null}

      {audioUrl && blob ? <Transcript text="" blob={blob} /> : null}
    </div>
  );
}
