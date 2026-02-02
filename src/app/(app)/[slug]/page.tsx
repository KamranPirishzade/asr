'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Recording as RecordingType } from '@/lib/db/db';
import Recording from '@/components/recorder/Recording';
import { useRecordingsContext } from '@/providers/RecordingsContext';
import Loading from '@/components/ui/Loading';

export default function Page() {
  const params = useParams();
  const { getRecordingById } = useRecordingsContext();

  const [recording, setRecording] = useState<RecordingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = params.slug;

  useEffect(() => {
    if (typeof slug !== 'string') {
      setError('Invalid URL');
      setLoading(false);
      return;
    }

    const fetchRecording = async () => {
      try {
        const result = await getRecordingById(slug);

        if (!result) {
          setError('Recording not found');
        } else {
          setRecording(result);
        }
      } catch {
        setError('Failed to load recording');
      } finally {
        setLoading(false);
      }
    };

    fetchRecording();
  }, [slug, getRecordingById]);

  if (loading)
    return (
      <div className="m-4 flex w-full flex-col">
        <Loading />
      </div>
    );
  if (error) return <div className="m-4 flex w-full flex-col">{error}</div>;

  if (!recording) {
    return (
      <div className="m-4 flex w-full flex-col">{'Recording not found'}</div>
    );
  }

  return (
    <div className="m-4 flex w-full flex-col">
      <Recording recording={recording} />
    </div>
  );
}
