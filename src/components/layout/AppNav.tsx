'use client';

import { logoutAction } from '@/lib/auth/actions';
import Button from '../ui/Button';
import { LogOut, EyeClosed, Eye } from 'lucide-react';
import { useRecordingsContext } from '@/providers/RecordingsContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Loading from '../ui/Loading';
export default function AppNav() {
  const { recordings, isLoading } = useRecordingsContext();
  const [open, setOpen] = useState(false);

  const handleNav = () => {
    setOpen((pre) => !pre);
  };

  return (
    <nav
      className={cn(
        'bg-main relative m-4 flex w-64 flex-col justify-start rounded-2xl border border-neutral-400 p-2 shadow-xl transition-all transition-discrete duration-300',
        {
          'w-10 -translate-x-[200%]': open,
        }
      )}
    >
      <h2 className="mb-2 border-b border-neutral-400 text-center font-light tracking-widest">
        ASR
      </h2>
      {open ? (
        <Eye
          className={cn('text-secondary absolute top-1 -right-[200%]', {
            'top-1 right-1': !open,
          })}
          size={30}
          onClick={handleNav}
        />
      ) : (
        <EyeClosed
          className="text-secondary absolute top-1 right-1"
          size={30}
          onClick={handleNav}
        />
      )}

      <div className="mb-4 overflow-y-auto pr-2">
        <h2 className="mb-2 text-lg">Recordings</h2>
        <div className="grid gap-3">
          {isLoading ? <Loading /> : ''}
          {recordings.map((recording) => (
            <Link
              key={recording.id}
              className="truncate"
              href={`/${recording.id}`}
            >
              <div className="text-secondary cursor-pointer truncate rounded-xl border-b-2 p-1 text-ellipsis transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                {recording.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <form action={logoutAction} className="mt-auto">
        <Button
          type="submit"
          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-red-600 ring-1 transition-all hover:bg-red-500"
        >
          <LogOut size={20} />
          Sign Out
        </Button>
      </form>
    </nav>
  );
}
