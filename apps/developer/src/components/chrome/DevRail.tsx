'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VerityMarkCream } from '@/components/brand/VerityMarkCream';
import { authService } from '@/lib/services';

const WORKSPACE = [
  { id: 'dashboard',  label: 'Dashboard',    href: '/dashboard',           icon: '◇' },
  { id: 'portfolio',  label: 'Portfolio',    href: '/portfolio',           icon: '▤' },
  { id: 'add',        label: 'Add property', href: '/portfolio/add/type',  icon: '+' },
  { id: 'distribute', label: 'Distribute',   href: '/distribute',          icon: '↗' },
] as const;

const ACCOUNT = [
  { id: 'team',    label: 'Team',    href: '/account/team',    icon: '◯' },
  { id: 'billing', label: 'Billing', href: '/account/billing', icon: '$' },
  { id: 'account', label: 'Account', href: '/account',         icon: '▦' },
] as const;

function activeFor(pathname: string, id: string, href: string): boolean {
  if (id === 'add') return pathname.startsWith('/portfolio/add');
  if (id === 'portfolio') return pathname === '/portfolio' || (pathname.startsWith('/portfolio/') && !pathname.startsWith('/portfolio/add'));
  if (id === 'account') return pathname === '/account';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DevRail() {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState('—');
  const [initial, setInitial] = useState('•');

  useEffect(() => {
    const s = authService.getSession();
    if (s) {
      setName(s.fullName);
      setInitial(s.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || s.fullName.charAt(0).toUpperCase());
    }
  }, []);

  function onSignOut() {
    authService.signOut();
    router.replace('/signin');
  }

  return (
    <aside className="dv-rail">
      <Link href="/dashboard" className="brand">
        <VerityMarkCream size={28} />
        <div>
          <div className="word">VERITY</div>
          <div className="meta">Developer · Lagos</div>
        </div>
      </Link>

      <div className="group-label">Workspace</div>
      <nav className="nav">
        {WORKSPACE.map((it) => (
          <Link key={it.id} href={it.href} className={`nav-item ${activeFor(pathname, it.id, it.href) ? 'active' : ''}`}>
            <span className="ic">{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>

      <div className="group-label">Account</div>
      <nav className="nav">
        {ACCOUNT.map((it) => (
          <Link key={it.id} href={it.href} className={`nav-item ${activeFor(pathname, it.id, it.href) ? 'active' : ''}`}>
            <span className="ic">{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>

      <div className="rail-foot">
        <div className="rail-user">
          <span className="ava">{initial}</span>
          <div className="who">
            <div className="name">{name}</div>
            <div className="role">Founding 50 · Cohort 014</div>
          </div>
        </div>
        <button type="button" className="signout-btn" onClick={onSignOut}>
          Sign out →
        </button>
      </div>
    </aside>
  );
}
