import { logoutAction } from '@/lib/auth/actions';
import Button from '../ui/Button';
import { LogOut } from 'lucide-react';

export default function AppNav() {
  return (
    <nav className="m-4 flex w-64 flex-col justify-start rounded-2xl border border-neutral-400 p-2 shadow-xl">
      <div>
        <h2 className="mb-2 border-b border-neutral-400 text-center font-light tracking-widest">
          ASR
        </h2>
      </div>
      <div>
        <h2 className="mb-2 text-lg">Projects</h2>
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
