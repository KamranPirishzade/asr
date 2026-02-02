import AppNav from '@/components/layout/AppNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-main flex h-screen">
      <AppNav />
      {children}
    </div>
  );
}
