import Dexie, { Table } from 'dexie';

export interface Recording {
  id: string;
  label: string;
  audioBlob: Blob;
  transcript: string;
  recordingType: 'manual' | 'auto';
  createdAt: number;
  syncStatus: 'pending' | 'synced' | 'failed';
  isPinned: boolean;
}

export class AudioTranscriptionDB extends Dexie {
  recordings!: Table<Recording, string>;

  constructor() {
    super('AudioTranscriptionDB');
    this.version(1).stores({
      recordings: '++id, createdAt, syncStatus',
    });
    this.version(2)
      .stores({
        recordings: '++id, createdAt, syncStatus, isPinned',
      })
      .upgrade(async (tx) => {
        await tx
          .table('recordings')
          .toCollection()
          .modify((recording: Partial<Recording>) => {
            if (recording.isPinned === undefined) {
              recording.isPinned = false;
            }
          });
      });

    this.version(3)
      .stores({
        recordings: '++id, createdAt, syncStatus, isPinned, recordingType',
      })
      .upgrade(async (tx) => {
        await tx
          .table('recordings')
          .toCollection()
          .modify((recording: Partial<Recording>) => {
            if (recording.recordingType === undefined) {
              recording.recordingType = 'auto';
            }
          });
      });
  }
}

export const db = new AudioTranscriptionDB();
