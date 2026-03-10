'use client';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/lib/auth/actions';
import { useActionState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/auto-transcribe');
      router.refresh();
    }
  }, [state?.success, router]);
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Log In</h2>
          <p className="mt-2 text-gray-600">
            Enter your credentials to start recording
          </p>
        </div>

        <form className="mt-8 space-y-6" action={formAction}>
          <div className="space-y-4">
            <label htmlFor="email">Email</label>
            <Input
              type="text"
              className={cn('w-full', {
                'ring-1 ring-red-500 focus:ring-2': state?.errors?.email,
              })}
              name="email"
              id="email"
            />

            <label htmlFor="password">Password</label>
            <Input
              type="password"
              className={cn('w-full', {
                'ring-1 ring-red-500 focus:ring-2': state?.errors?.email,
              })}
              name="password"
              id="password"
            />
          </div>
          <div className="flex flex-col gap-1">
            {state?.message && (
              <p className="text-center text-sm font-medium text-red-500">
                {state.message}
              </p>
            )}
            {state?.errors?.email && (
              <p className="mt-1 text-xs text-red-500">
                {state.errors.email[0]}
              </p>
            )}
            {state?.errors?.password && (
              <p className="text-xs text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Connecting...' : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
