'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services';

export function SignedInGuard({ children, redirectTo = '/dashboard' }: { children: React.ReactNode; redirectTo?: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authService.getSession()) {
      router.replace(redirectTo);
    } else {
      setReady(true);
    }
  }, [router, redirectTo]);

  if (!ready) return null;
  return <>{children}</>;
}
