import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between px-16 py-32 sm:items-start">
        <Button variant="primary">Hello</Button>
      </main>
    </div>
  );
}
