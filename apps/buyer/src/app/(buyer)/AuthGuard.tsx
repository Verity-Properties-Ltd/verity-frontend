'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'ok'>('checking');

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace('/signup');
      return;
    }
    if (session.role !== 'buyer') {
      // Developer hit a buyer route — bounce to the dev app's dashboard.
      // The dev app runs separately; this just sends them to the right entry URL.
      window.location.href = '/developer/dashboard';
      return;
    }
    setState('ok');
  }, [router]);

  if (state === 'checking') {
    return (
      <div style={{ padding: 40, color: 'var(--slate)', fontFamily: 'var(--f-body)', fontSize: 14 }}>
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}
