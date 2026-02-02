import RecorderPanel from '@/components/recorder/RecorderPanel';
import ToggleNav from '@/components/layout/ToggleNav';
import Loading from '@/components/ui/Loading';
export default function page() {
  return (
    <section className="flex flex-1 flex-col bg-white p-4">
      <div className="flex-1 self-center">
        <ToggleNav />
        <Loading />
      </div>
      <RecorderPanel />
    </section>
  );
}
