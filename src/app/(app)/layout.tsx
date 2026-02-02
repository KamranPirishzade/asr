import AppNav from '@/components/layout/AppNav';
import { useRecordings } from '@/hooks/useRecordings';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-main flex h-screen">
      <AppNav />
      {children}
    </div>
  );
}
