'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VerityMark } from '@/components/brand/VerityMark';
import { authService } from '@/lib/services';

const ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'new', label: 'New request', href: '/request/new/property' },
  { id: 'history', label: 'History', href: '/history' },
  { id: 'account', label: 'Account', href: '/account' },
] as const;

export function DesktopRail() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('—');
  const [initial, setInitial] = useState('•');

  useEffect(() => {
    const s = authService.getSession();
    if (s) {
      setUserName(s.fullName);
      setInitial(s.fullName.charAt(0).toUpperCase());
    }
  }, []);

  function onSignOut() {
    authService.signOut();
    router.replace('/signin');
  }

  return (
    <aside className="bf-rail">
      <Link href="/dashboard" className="rail-brand" style={{ textDecoration: 'none' }}>
        <VerityMark size={26} />
        <span className="word">VERITY</span>
      </Link>
      <nav className="rail-nav">
        {ITEMS.map((i) => {
          const active = pathname === i.href || (i.id === 'new' && pathname.startsWith('/request/new'));
          return (
            <Link key={i.id} href={i.href} className={`rail-item ${active ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              <span className="dot" />
              <span>{i.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="rail-foot">
        <div className="rail-user">
          <span className="ava">{initial}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="bf-body" style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <button
              type="button"
              onClick={onSignOut}
              className="bf-mono"
              style={{ background: 'transparent', border: 0, padding: 0, color: 'var(--slate)', letterSpacing: '0.18em', fontSize: 9, cursor: 'pointer', marginTop: 2, textTransform: 'uppercase' }}
            >
              Sign out →
            </button>
          </div>
        </div>
        <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em', marginTop: 16 }}>VERITY · LAGOS</div>
      </div>
    </aside>
  );
}
