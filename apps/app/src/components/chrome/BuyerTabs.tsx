'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', href: '/buyer' },
  { id: 'new', label: 'New request', href: '/buyer/request/new/property' },
  { id: 'history', label: 'History', href: '/buyer/history' },
  { id: 'account', label: 'Account', href: '/buyer/account' },
] as const;

export function BuyerTabs() {
  const pathname = usePathname();
  return (
    <div className="bf-tabs">
      {TABS.map((t) => {
        const active = pathname === t.href || (t.id === 'new' && pathname.startsWith('/buyer/request/new'));
        return (
          <Link key={t.id} href={t.href} className={`bf-tab ${active ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
