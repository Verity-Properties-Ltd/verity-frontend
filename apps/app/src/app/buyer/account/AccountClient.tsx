'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar } from '@/components/chrome/AppBar';
import { BuyerTabs } from '@/components/chrome/BuyerTabs';
import { authService } from '@/lib/services';
import type { Session } from '@/lib/types/auth';

function fmtMemberSince(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function AccountClient() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(authService.getSession());
  }, []);

  function onSignOut() {
    authService.signOut();
    router.replace('/signin/buyer');
  }

  if (!session) {
    return <div className="bf-main-inner" style={{ color: 'var(--slate)' }}>Loading…</div>;
  }

  const initial = session.fullName.charAt(0).toUpperCase();

  return (
    <>
      <div className="wizard-mobile-chrome">
        <AppBar
          back={false}
          title="VERITY"
          right={
            <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--navy)', color: 'var(--cream)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 14 }}>
              {initial}
            </span>
          }
        />
        <BuyerTabs />
      </div>

      <div className="bf-main-inner">
        <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Account</div>
        <h1 className="bf-page-h1">{session.fullName}</h1>

        <div className="bf-card cream" style={{ marginTop: 24, padding: 18, maxWidth: 560 }}>
          <div className="bf-stack" style={{ gap: 14 }}>
            <div className="bf-row" style={{ justifyContent: 'space-between' }}>
              <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>EMAIL</span>
              <span className="bf-mono" style={{ fontSize: 12, color: 'var(--navy)' }}>{session.email}</span>
            </div>
            <hr className="bf-divider" />
            <div className="bf-row" style={{ justifyContent: 'space-between' }}>
              <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>MEMBER SINCE</span>
              <span className="bf-mono" style={{ fontSize: 12, color: 'var(--navy)' }}>{fmtMemberSince(session.createdAt)}</span>
            </div>
            <hr className="bf-divider" />
            <div className="bf-row" style={{ justifyContent: 'space-between' }}>
              <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>USER ID</span>
              <span className="bf-mono" style={{ fontSize: 11, color: 'var(--slate)' }}>{session.userId}</span>
            </div>
          </div>
        </div>

        <div className="bf-eyebrow slate" style={{ marginTop: 32, marginBottom: 10 }}>— Preferences</div>
        <p className="bf-small" style={{ maxWidth: 480 }}>
          Notification, language, and billing preferences arrive after we wire real auth. For now this account is a local mock — refreshing the page keeps your session, but signing out clears it.
        </p>

        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className="bf-btn outline" onClick={onSignOut} style={{ width: 'auto', minWidth: 160 }}>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
