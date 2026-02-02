import ManualRecorder from '@/components/recorder/ManualRecorder';
import Transcript from '@/components/recorder/Transcriptx';
export default function page() {
  return (
    <section className="flex flex-1 flex-col bg-white p-4">
      <div className="flex-1">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Manual Transcribe
        </h1>
      </div>
      <ManualRecorder />
    </section>
  );
}
