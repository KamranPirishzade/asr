import Dexie, { Table } from 'dexie';

export interface Recording {
  id?: string;
  label: string;
  audioBlob: Blob;
  transcript: string;
  createdAt: number;
  syncStatus: 'pending' | 'synced' | 'failed';
}

export class AudioTranscriptionDB extends Dexie {
  recordings!: Table<Recording, string>;

  constructor() {
    super('AudioTranscriptionDB');
    this.version(1).stores({
      recordings: '++id, createdAt, syncStatus',
    });
  }
}

export const db = new AudioTranscriptionDB();
