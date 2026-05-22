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
    if (session.role !== 'developer') {
      // Buyer hit a developer route — bounce to the buyer host.
      window.location.href = 'http://localhost:3000/dashboard';
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
