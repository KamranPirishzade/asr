import ToggleNav from '@/components/layout/ToggleNav';
import ManualRecorder from '@/components/recorder/ManualRecorder';
export default function page() {
  return (
    <section className="flex flex-1 flex-col bg-white p-4">
      <div className="flex-1 self-center">
        <ToggleNav />
      </div>
      <ManualRecorder />
    </section>
  );
}
