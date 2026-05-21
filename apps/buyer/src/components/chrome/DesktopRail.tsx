'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VerityMark } from '@/components/brand/VerityMark';

const ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'new', label: 'New request', href: '/request/new/property' },
  { id: 'history', label: 'History', href: '/history' },
  { id: 'account', label: 'Account', href: '/account' },
] as const;

export function DesktopRail({ userInitial = 'A', userName = 'Adaeze Okonkwo', userMeta = 'BUYER · TIER 2' }: { userInitial?: string; userName?: string; userMeta?: string }) {
  const pathname = usePathname();
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
          <span className="ava">{userInitial}</span>
          <div>
            <div className="bf-body" style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}>{userName}</div>
            <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em' }}>{userMeta}</div>
          </div>
        </div>
        <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em', marginTop: 16 }}>VERITY · LAGOS</div>
      </div>
    </aside>
  );
}
