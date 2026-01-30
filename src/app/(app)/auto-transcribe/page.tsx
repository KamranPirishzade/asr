import RecorderPanel from '@/components/recorder/RecorderPanel';
export default function page() {
  return (
    <section className="flex flex-1 flex-col bg-white p-4">
      <div className="flex-1">
        <h1 className="mb-6 text-center text-2xl font-bold">Auto Transcribe</h1>
      </div>
      <RecorderPanel />
    </section>
  );
}