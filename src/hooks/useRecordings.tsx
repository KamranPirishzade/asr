import { useEffect, useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { db, type Recording } from '@/lib/db/db';

export function useRecordings() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecordings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const recordings = await db.recordings
        .orderBy('createdAt')
        .reverse()
        .toArray();
      setRecordings(recordings);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load recordings';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveRecording = useCallback(
    async (audioBlob: Blob, transcript: string, label?: string) => {
      try {
        const id = uuidv4();
        const recordingLabel =
          label || `Recording ${new Date().toLocaleString()}`;
        const newRecording: Recording = {
          id,
          label: recordingLabel,
          audioBlob,
          transcript,
          createdAt: Date.now(),
          syncStatus: 'pending',
        };

        await db.recordings.add(newRecording);
        await loadRecordings();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load recordings';
        setError(message);
      }
    },
    [loadRecordings]
  );

  const deleteRecording = useCallback(
    async (id: string) => {
      try {
        await db.recordings.delete(id);
        await loadRecordings();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load recordings';
        setError(message);
        throw err;
      }
    },
    [loadRecordings]
  );

  const updateTranscript = useCallback(
    async (id: string, transcript: string) => {
      try {
        await db.recordings.update(id, {
          transcript: transcript,
          syncStatus: 'pending',
        });
        await loadRecordings();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update transcript';
        setError(message);
        throw err;
      }
    },
    [loadRecordings]
  );

  const markSynced = useCallback(
    async (id: string) => {
      try {
        await db.recordings.update(id, {
          syncStatus: 'synced',
        });

        await loadRecordings();
      } catch (err) {
        console.error('Error marking recording as synced:', err);
        throw err;
      }
    },
    [loadRecordings]
  );

  const markFailed = useCallback(
    async (id: string) => {
      try {
        await db.recordings.update(id, {
          syncStatus: 'failed',
        });

        await loadRecordings();
      } catch (err) {
        console.error('Error marking recording as failed:', err);
        throw err;
      }
    },
    [loadRecordings]
  );

  const getPendingRecordings = useCallback(async () => {
    try {
      return await db.recordings
        .where('syncStatus')
        .equals('pending')
        .toArray();
    } catch (err) {
      console.error('Error getting pending recordings:', err);
      return [];
    }
  }, []);

  const getRecordingById = useCallback(async (id: string) => {
    try {
      return await db.recordings.get(id);
    } catch (err) {
      console.error('Error getting recording:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    loadRecordings();
  }, [loadRecordings]);

  return {
    recordings,
    isLoading,
    error,

    saveRecording,
    deleteRecording,
    updateTranscript,
    markSynced,
    markFailed,
    getPendingRecordings,
    getRecordingById,
    refresh: loadRecordings,
  };
}
