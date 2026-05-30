'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@dev/lib/services';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'ok'>('checking');

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace('/signup/developer');
      return;
    }
    if (session.role !== 'developer') {
      router.replace('/buyer');
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
