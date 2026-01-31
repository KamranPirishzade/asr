'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Circle } from 'lucide-react';
import Button from '@/components/ui/Button';
import TranscriptResult from './TranscriptResult';
import { useTranscriber } from '@/hooks/useTranscriber';

export default function RecorderPanel() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [buffer, setBuffer] = useState<AudioBuffer>();

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const {
    onInputChange,
    isProcessing,
    isModelLoading,
    modelLoadingProgress,
    start,
    output,
  } = useTranscriber();
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        setBuffer(audioBuffer);
        setAudioUrl(url);
        start(audioBuffer);
        audioChunks.current = [];
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

  useEffect(() => {
    console.log(output);
  }, [output]);

  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-400 p-4 shadow-2xl">
      <div className="mb-2">
        {isRecording ? (
          <div className="flex animate-pulse items-center gap-2 text-red-500">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-sm font-bold tracking-wider uppercase">
              Recording...
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Ready to record</span>
        )}
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        {audioUrl && (
          <div className="w-full">
            <p className="mb-2 text-xs text-gray-500">
              Preview last recording:
            </p>
            <audio src={audioUrl} controls className="h-10 w-full" />
          </div>
        )}
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="flex h-16 w-16 items-center rounded-full"
          >
            <Mic size={28} />
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="secondary"
            className="grid h-16 w-16 place-content-center rounded-full border-red-500 text-red-500"
          >
            <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-red-500"></div>
          </Button>
        )}
      </div>
      <div className="mt-4 w-full">
        {isProcessing && (
          <p className="text-secondary animate-pulse text-sm font-semibold">
            Model is transcribing...
          </p>
        )}
      </div>

      {output ? (
        <TranscriptResult
          text={output.text}
          isProcessing={isProcessing}
          onClear={onInputChange}
          start={() => start(buffer)}
        />
      ) : (
        ''
      )}
    </div>
  );
}
