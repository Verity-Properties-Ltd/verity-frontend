'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'new', label: 'New request', href: '/request/new/property' },
  { id: 'history', label: 'History', href: '/history' },
  { id: 'account', label: 'Account', href: '/account' },
] as const;

export function BuyerTabs() {
  const pathname = usePathname();
  return (
    <div className="bf-tabs">
      {TABS.map((t) => {
        const active = pathname === t.href || (t.id === 'new' && pathname.startsWith('/request/new'));
        return (
          <Link key={t.id} href={t.href} className={`bf-tab ${active ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
