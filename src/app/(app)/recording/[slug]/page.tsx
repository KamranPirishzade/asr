'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Recording from '@/components/recorder/Recording';
import { useRecordingsContext } from '@/providers/RecordingsContext';
import Loading from '@/components/ui/Loading';

export default function Page() {
  const params = useParams();
  const {
    recordings,
    isLoading,
    hasLoaded,
    deleteRecording,
    markPending,
    markSynced,
    markFailed,
    togglePinned,
    updateTranscript,
  } = useRecordingsContext();

  const slug = useMemo(() => {
    if (Array.isArray(params.slug)) {
      return params.slug[0] ?? '';
    }

    return params.slug ?? '';
  }, [params.slug]);

  const recording = recordings.find((r) => r.id === slug);

  if (isLoading || !hasLoaded) {
    return (
      <div className="m-4 flex w-full flex-col">
        <Loading />
      </div>
    );
  }

  if (hasLoaded && !recording) {
    return (
      <div className="m-4 grid w-full place-content-center rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-3xl font-semibold text-gray-800">
          Recording not found
        </p>
        <p className="mt-2 text-sm text-gray-500">
          The recording may have been deleted or does not exist.
        </p>
      </div>
    );
  }

  const selectedRecording = recording;

  if (!selectedRecording) {
    return null;
  }

  return (
    <div className="from-main/40 to-main/10 flex flex-1 flex-col bg-linear-to-b p-4">
      <Recording
        recording={selectedRecording}
        onDelete={deleteRecording}
        onMarkPending={markPending}
        onMarkSynced={markSynced}
        onMarkFailed={markFailed}
        onTogglePinned={togglePinned}
        saveTranscript={updateTranscript}
      />
    </div>
  );
}
