import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-main grid h-screen place-content-center gap-4 text-center">
      <p className="text-9xl">404</p>
      <p className="text-5xl">Page not found</p>
      <Link
        href={'/auto-transcribe'}
        className="group flex justify-center gap-2 font-semibold"
      >
        <MoveLeft className="transition-all duration-300 group-hover:-translate-x-2" />
        <p>Back to app</p>
      </Link>
    </div>
  );
}
