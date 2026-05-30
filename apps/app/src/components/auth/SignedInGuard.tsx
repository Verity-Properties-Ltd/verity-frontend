'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services';

export function SignedInGuard({ children, redirectTo = '/buyer' }: { children: React.ReactNode; redirectTo?: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session?.role === 'developer') {
      router.replace('/developer');
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
