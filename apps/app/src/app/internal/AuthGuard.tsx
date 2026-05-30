'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services';

/** Internal admin guard. Per UI/UX §2.5 internal accounts are invite-only
 *  with mandatory MFA — for Phase 1 the scaffold accepts any session with
 *  role === 'internal'. If no internal session exists, a tiny dev affordance
 *  in InternalLanding (page.tsx) lets you mint a demo session per sub-role. */
export function InternalAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'ok' | 'not-internal' | 'none'>('checking');

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      setState('none');
      return;
    }
    if (session.role !== 'internal') {
      setState('not-internal');
      return;
    }
    setState('ok');
  }, []);

  if (state === 'checking') {
    return <div className="int-loading">Loading…</div>;
  }

  if (state === 'none' || state === 'not-internal') {
    return (
      <div className="int-gate">
        <div className="int-gate-panel">
          <div className="eyebrow">Internal · invite-only</div>
          <h1>Internal admin shell</h1>
          <p>
            Per UI/UX §2.5 internal accounts are invite-only with mandatory MFA. This Phase 1 scaffold
            isn&rsquo;t wired to real auth yet — the surfaces below are navigable shells so the build
            backlog stories (ANL-*, OPS-*, SUP-*) can execute against the right IA.
          </p>
          <div className="int-gate-actions">
            <DemoButton subRole="specialist">Demo as Specialist</DemoButton>
            <DemoButton subRole="ops">Demo as Operations</DemoButton>
            <DemoButton subRole="admin">Demo as Super Admin</DemoButton>
            <DemoButton subRole="registry">Demo as Registry Liaison</DemoButton>
          </div>
          <p className="aux">
            Or sign in as <a href="/signin/buyer">buyer</a> · <a href="/signin/developer">developer</a>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function DemoButton({
  subRole,
  children,
}: {
  subRole: 'specialist' | 'ops' | 'admin' | 'registry';
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="int-demo-btn"
      onClick={() => {
        const session = {
          userId: `demo-${subRole}`,
          fullName: `Demo ${subRole.charAt(0).toUpperCase()}${subRole.slice(1)}`,
          email: `${subRole}@verity.test`,
          role: 'internal' as const,
          subRole,
          createdAt: new Date().toISOString(),
        };
        window.localStorage.setItem('verity:session', JSON.stringify(session));
        const landing =
          subRole === 'specialist' ? '/internal/specialist' :
          subRole === 'ops' ? '/internal/ops' :
          subRole === 'admin' ? '/internal/admin' :
          '/internal/registry';
        router.push(landing);
      }}
    >
      {children}
    </button>
  );
}
