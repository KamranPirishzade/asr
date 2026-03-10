import RecorderPanel from '@/components/recorder/RecorderPanel';
import ToggleNav from '@/components/layout/ToggleNav';
export default function page() {
  return (
    <section className="flex flex-1 flex-col bg-white p-4">
      <div className="flex-1 self-center">
        <ToggleNav />
      </div>
      <RecorderPanel />
    </section>
  );
}
