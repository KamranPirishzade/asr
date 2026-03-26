import { useWorker } from './useWhisper';
import { useCallback, useMemo, useRef, useState } from 'react';

export function useTranscriber() {
  const [output, setOutput] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const activeJobIdRef = useRef<number | null>(null);
  const jobCounterRef = useRef(0);

  const { postMessage } = useWorker((event) => {
    const message = event.data;

    if (typeof message?.jobId === 'number') {
      const isActiveJob = activeJobIdRef.current === message.jobId;
      if (!isActiveJob && message.status !== 'progress') {
        return;
      }
    }

    switch (message.status) {
      case 'progress':
        setIsModelLoading(true);
        setModelLoadingProgress(message.progress);
        break;
      case 'update':
        break;
      case 'complete':
        setOutput(message.output?.text);
        setError(null);
        setIsProcessing(false);
        setIsModelLoading(false);
        activeJobIdRef.current = null;
        break;
      case 'ready':
        setIsModelLoading(false);
        break;
      case 'error':
        setError(
          message.output instanceof Error
            ? message.output.message
            : 'Transcription failed. Please try again.'
        );
        setIsProcessing(false);
        setIsModelLoading(false);
        activeJobIdRef.current = null;
        break;
      case 'done':
        break;
      default:
        break;
    }
  });

  const onInputChange = useCallback(() => {
    setOutput(undefined);
    setError(null);
  }, []);

  const start = useCallback(
    async (audioData: AudioBuffer | undefined) => {
      if (audioData) {
        const nextJobId = ++jobCounterRef.current;
        activeJobIdRef.current = nextJobId;
        setOutput(undefined);
        setError(null);
        setIsProcessing(true);
        let audio;
        if (audioData.numberOfChannels === 2) {
          const SCALING_FACTOR = Math.sqrt(2);

          const left = audioData.getChannelData(0);
          const right = audioData.getChannelData(1);

          audio = new Float32Array(left.length);
          for (let i = 0; i < audioData.length; ++i) {
            audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2;
          }
        } else {
          audio = audioData.getChannelData(0);
        }

        postMessage({ type: 'transcribe', audio, jobId: nextJobId });
      }
    },
    [postMessage]
  );

  const transcriber = useMemo(() => {
    return {
      onInputChange,
      isProcessing,
      isModelLoading,
      modelLoadingProgress,
      start,
      output,
      error,
    };
  }, [
    onInputChange,
    isProcessing,
    isModelLoading,
    modelLoadingProgress,
    start,
    output,
    error,
  ]);

  return transcriber;
}
