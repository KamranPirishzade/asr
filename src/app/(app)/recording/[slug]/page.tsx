'use client';

import { useParams } from 'next/navigation';
import Recording from '@/components/recorder/Recording';
import { useRecordingsContext } from '@/providers/RecordingsContext';
import Loading from '@/components/ui/Loading';
import ToggleNav from '@/components/layout/ToggleNav';

export default function Page() {
  const params = useParams();
  const {
    recordings,
    isLoading,
    deleteRecording,
    markPending,
    markSynced,
    markFailed,
  } = useRecordingsContext();

  const slug = params.slug;

  const recording = recordings.find((r) => r.id === slug);

  if (isLoading) {
    return (
      <div className="m-4 flex w-full flex-col">
        <Loading />
      </div>
    );
  }

  if (!recording) {
    return <div className="m-4 flex w-full flex-col">Recording not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col bg-white p-4">
      <ToggleNav />
      <Recording
        recording={recording}
        onDelete={deleteRecording}
        onMarkPending={markPending}
        onMarkSynced={markSynced}
        onMarkFailed={markFailed}
      />
    </div>
  );
}
