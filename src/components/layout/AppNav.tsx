'use client';

import { logoutAction } from '@/lib/auth/actions';
import Button from '../ui/Button';
import {
  AudioLines,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Mic,
  Pin,
  Search,
} from 'lucide-react';
import { useRecordingsContext } from '@/providers/RecordingsContext';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Loading from '../ui/Loading';
import { usePathname } from 'next/navigation';

export default function AppNav() {
  const { recordings, isLoading } = useRecordingsContext();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState('');

  const filteredRecordings = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return recordings;
    }

    return recordings.filter((recording) =>
      recording.label.toLowerCase().includes(trimmed)
    );
  }, [query, recordings]);

  const pendingCount = useMemo(
    () =>
      recordings.filter((recording) => recording.syncStatus === 'pending')
        .length,
    [recordings]
  );

  const failedCount = useMemo(
    () =>
      recordings.filter((recording) => recording.syncStatus === 'failed')
        .length,
    [recordings]
  );

  const syncedCount = useMemo(
    () =>
      recordings.filter((recording) => recording.syncStatus === 'synced')
        .length,
    [recordings]
  );

  const latestRecording = useMemo(() => recordings[0], [recordings]);

  const getCompactLabel = (label: string) => {
    const trimmed = label.trim();
    if (trimmed.length <= 6) {
      return trimmed;
    }

    return `${trimmed.slice(0, 6)}...`;
  };

  return (
    <nav
      className={cn(
        'bg-main m-4 flex h-[calc(100vh-2rem)] flex-col rounded-xl border border-neutral-400 p-2 shadow-xl transition-all duration-300 ease-out',
        {
          'w-72': !collapsed,
          'w-16': collapsed,
        }
      )}
    >
      <div className="mb-3 flex items-center justify-between border-b border-neutral-400 pb-2">
        {!collapsed ? (
          <h2 className="font-light tracking-[0.25em]">ASR</h2>
        ) : (
          <p className="mx-auto text-xs font-semibold tracking-widest">ASR</p>
        )}

        <button
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed((prev) => !prev)}
          className="text-secondary rounded-md p-1 transition-colors hover:bg-white/70 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed ? (
        <>
          <div className="mb-3 grid gap-2">
            {latestRecording ? (
              <Link
                href={`/recording/${latestRecording.id}`}
                className={cn(
                  'text-secondary flex items-center gap-2 rounded-md border border-neutral-300 px-2 py-1.5 text-sm transition-colors hover:bg-white/70',
                  {
                    'bg-white font-semibold':
                      pathname === `/recording/${latestRecording.id}`,
                  }
                )}
              >
                <AudioLines size={16} />
                Continue latest
                {latestRecording.isPinned ? (
                  <Pin size={14} className="ml-auto text-amber-500" />
                ) : null}
              </Link>
            ) : null}

            <Link
              href="/auto-transcribe"
              className={cn(
                'text-secondary flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/70',
                {
                  'bg-white font-semibold': pathname === '/auto-transcribe',
                }
              )}
            >
              <AudioLines size={16} />
              Auto transcribe
            </Link>

            <Link
              href="/manual-transcribe"
              className={cn(
                'text-secondary flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-white/70',
                {
                  'bg-white font-semibold': pathname === '/manual-transcribe',
                }
              )}
            >
              <Mic size={16} />
              Manual transcribe
            </Link>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-md bg-white/70 p-1.5">
              <p className="text-[10px] text-gray-500">ALL</p>
              <p className="font-semibold">{recordings.length}</p>
            </div>
            <div className="rounded-md bg-emerald-100 p-1.5">
              <p className="text-[10px] text-emerald-700">SYNCED</p>
              <p className="font-semibold text-emerald-700">{syncedCount}</p>
            </div>
            <div className="rounded-md bg-orange-100 p-1.5">
              <p className="text-[10px] text-orange-700">PENDING</p>
              <p className="font-semibold text-orange-700">{pendingCount}</p>
            </div>
            <div className="rounded-md bg-red-100 p-1.5">
              <p className="text-[10px] text-red-700">FAILED</p>
              <p className="font-semibold text-red-700">{failedCount}</p>
            </div>
          </div>

          <div className="mb-2 rounded-md border border-neutral-300 bg-white px-2">
            <label htmlFor="recording-search" className="sr-only">
              Search recordings
            </label>
            <div className="flex items-center gap-2">
              <Search size={14} className="text-gray-500" />
              <input
                id="recording-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search recordings"
                className="w-full border-none bg-transparent py-2 text-sm outline-none"
              />
            </div>
          </div>
        </>
      ) : null}

      <div className={cn('mb-4 overflow-y-auto pr-1', { 'pr-0': collapsed })}>
        <div className="grid gap-2">
          {isLoading ? <Loading scale="small" /> : null}

          {!isLoading && filteredRecordings.length === 0 ? (
            <p className="px-1 text-sm text-gray-500">
              {recordings.length === 0
                ? 'No recordings found.'
                : 'No matching recordings.'}
            </p>
          ) : (
            filteredRecordings.map((recording) => (
              <Link
                key={recording.id}
                className={cn(
                  'text-secondary hover:bg-secondary/80 hover:text-main block truncate rounded-md px-2 py-1.5 text-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm',
                  {
                    'bg-secondary text-main':
                      pathname === `/recording/${recording.id}`,
                    'text-center': collapsed,
                  }
                )}
                href={`/recording/${recording.id}`}
                title={recording.label}
              >
                <span className="inline-flex items-center gap-1.5">
                  {!collapsed ? (
                    <span
                      className={cn('h-2 w-2 rounded-full', {
                        'bg-emerald-500': recording.syncStatus === 'synced',
                        'bg-orange-500': recording.syncStatus === 'pending',
                        'bg-red-500': recording.syncStatus === 'failed',
                      })}
                    />
                  ) : null}
                  <span>
                    {collapsed
                      ? getCompactLabel(recording.label)
                      : recording.label}
                  </span>
                  {!collapsed && recording.isPinned ? (
                    <Pin size={12} className="text-amber-500" />
                  ) : null}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      <form action={logoutAction} className="mt-auto">
        <Button
          type="submit"
          className={cn(
            'flex w-full items-center rounded-md px-3 py-2 text-red-600 ring-1 transition-all hover:bg-red-500',
            {
              'justify-center': collapsed,
              'justify-start gap-2': !collapsed,
            }
          )}
        >
          <LogOut className="shrink-0" size={20} />
          {!collapsed ? 'Sign Out' : null}
        </Button>
      </form>
    </nav>
  );
}
