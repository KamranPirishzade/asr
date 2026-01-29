import { logoutAction } from '@/lib/auth/actions';
import Button from '../ui/Button';
import { LogOut } from 'lucide-react';

export default function AppNav() {
  return (
    <nav className="border-secondary m-4 flex w-64 flex-col justify-between rounded-2xl border-r-3 p-2">
      <div>
        <h2 className="mb-4 text-center font-light tracking-widest">ASR</h2>
      </div>
      <form action={logoutAction}>
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
