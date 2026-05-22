'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services';

/**
 * If a developer is already signed in, bounce them off the auth pages.
 * If a buyer somehow lands here, send them back to the buyer host.
 */
export function SignedInGuard({ children, redirectTo = '/dashboard' }: { children: React.ReactNode; redirectTo?: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session?.role === 'buyer') {
      window.location.href = 'http://localhost:3000/dashboard';
      return;
    }
    if (session) {
      router.replace(redirectTo);
    } else {
      setReady(true);
    }
  }, [router, redirectTo]);

  if (!ready) return null;
  return <>{children}</>;
}
