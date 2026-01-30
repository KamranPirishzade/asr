import { useWorker } from './useWhisper';
import { useCallback, useState, useMemo } from 'react';

export function useTranscriber() {
  const [output, setOutput] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);

  const webWorker = useWorker((event) => {
    const message = event.data;
    switch (message.status) {
      case 'progress':
        setModelLoadingProgress(message.progress);
        break;
      case 'update':
        break;
      case 'complete':
        setOutput(message.output);
        setIsProcessing(false);
        break;
      case 'ready':
        setIsModelLoading(true);
        break;
      case 'error':
        setIsProcessing(false);
        break;
      case 'done':
        break;
      default:
        break;
    }
  });

  const onInputChange = useCallback(() => {
    setOutput(undefined);
  }, []);

  const start = useCallback(
    async (audioData: AudioBuffer | undefined) => {
      if (audioData) {
        setOutput(undefined);
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

        webWorker?.postMessage({ audio });
      }
    },
    [webWorker]
  );

  const transcriber = useMemo(() => {
    return {
      onInputChange,
      isProcessing,
      isModelLoading,
      modelLoadingProgress,
      start,
      output,
    };
  }, [
    onInputChange,
    isProcessing,
    isModelLoading,
    modelLoadingProgress,
    start,
    output,
  ]);

  return transcriber;
}
