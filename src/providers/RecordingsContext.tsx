'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRecordings } from '@/hooks/useRecordings';

type RecordingsContextType = ReturnType<typeof useRecordings>;

const RecordingsContext = createContext<RecordingsContextType | null>(null);

export function RecordingsProvider({ children }: { children: ReactNode }) {
  const recordingsHook = useRecordings();

  return (
    <RecordingsContext.Provider value={recordingsHook}>
      {children}
    </RecordingsContext.Provider>
  );
}

export function useRecordingsContext() {
  const context = useContext(RecordingsContext);
  if (!context) {
    throw new Error('There is a problem in provider place');
  }
  return context;
}
