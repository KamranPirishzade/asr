'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ToggleNav() {
  const pathname = usePathname();
  return (
    <div className="m-5 inline-flex gap-1 self-center rounded-full border border-gray-400 p-1">
      <Link href="/manual-transcribe">
        <div
          className={cn('rounded-full p-2', {
            'bg-gray-200': pathname === '/manual-transcribe',
          })}
        >
          Manual transcribe
        </div>
      </Link>
      <Link href="/auto-transcribe">
        <div
          className={cn('rounded-full p-2', {
            'bg-gray-200': pathname === '/auto-transcribe',
          })}
        >
          {' '}
          Auto transcribe
        </div>
      </Link>
    </div>
  );
}
