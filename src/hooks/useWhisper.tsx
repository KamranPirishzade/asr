import { useCallback, useEffect, useRef } from 'react';

export interface MessageEventHandler {
  (event: MessageEvent): void;
}

export interface WhisperWorkerControls {
  postMessage: (payload: unknown) => void;
  restartWorker: () => void;
  terminateWorker: () => void;
}

export function useWorker(messageEventHandler: MessageEventHandler) {
  const workerRef = useRef<Worker | null>(null);
  const handlerRef = useRef<MessageEventHandler>(messageEventHandler);

  useEffect(() => {
    handlerRef.current = messageEventHandler;
  }, [messageEventHandler]);

  const createAndAttachWorker = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const worker = new Worker(
      new URL('../lib/worker/worker.js', import.meta.url),
      {
        type: 'module',
      }
    );

    worker.addEventListener('message', (event) => {
      handlerRef.current(event);
    });

    workerRef.current = worker;
    return worker;
  }, []);

  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  const restartWorker = useCallback(() => {
    terminateWorker();
    createAndAttachWorker();
  }, [createAndAttachWorker, terminateWorker]);

  const postMessage = useCallback(
    (payload: unknown) => {
      if (!workerRef.current) {
        createAndAttachWorker();
      }

      workerRef.current?.postMessage(payload);
    },
    [createAndAttachWorker]
  );

  useEffect(() => {
    createAndAttachWorker();
    return () => {
      terminateWorker();
    };
  }, [createAndAttachWorker, terminateWorker]);

  return {
    postMessage,
    restartWorker,
    terminateWorker,
  } satisfies WhisperWorkerControls;
}
