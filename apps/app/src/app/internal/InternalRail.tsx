'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/lib/services';
import type { InternalSubRole } from '@/lib/types/auth';

type Item = { id: string; label: string; href: string; roles: InternalSubRole[] | 'all' };

const ITEMS: Item[] = [
  { id: 'specialist',        label: 'My Queue',          href: '/internal/specialist',        roles: ['specialist'] },
  { id: 'ops-board',         label: 'Production Board',  href: '/internal/ops',               roles: ['ops'] },
  { id: 'ops-assign',        label: 'Assignment & Review', href: '/internal/ops/assign',      roles: ['ops'] },
  { id: 'admin-accounts',    label: 'Accounts & Users',   href: '/internal/admin/accounts',   roles: ['admin'] },
  { id: 'admin-dev-queue',   label: 'Developer Queue',    href: '/internal/admin/developer-queue', roles: ['admin'] },
  { id: 'admin-pricing',     label: 'Pricing & Plans',    href: '/internal/admin/pricing',    roles: ['admin'] },
  { id: 'admin-analytics',   label: 'Platform Analytics', href: '/internal/admin/analytics',  roles: ['admin'] },
  { id: 'registry',          label: 'Registry Liaison',   href: '/internal/registry',         roles: ['registry'] },
];

export function InternalRail() {
  const pathname = usePathname();
  const router = useRouter();
  const [subRole, setSubRole] = useState<InternalSubRole | undefined>(undefined);

  useEffect(() => {
    const session = authService.getSession();
    setSubRole(session?.subRole);
  }, []);

  const visible = ITEMS.filter((i) => i.roles === 'all' || (subRole && i.roles.includes(subRole)));

  return (
    <aside className="int-rail">
      <Link href="/internal" className="int-rail-brand" style={{ textDecoration: 'none' }}>
        <span className="word">VERITY</span>
        <span className="meta">Internal · {subRole ?? '—'}</span>
      </Link>

      <nav aria-label="Internal navigation">
        {visible.map((i) => {
          const active = pathname === i.href || pathname.startsWith(`${i.href}/`);
          return (
            <Link key={i.id} href={i.href} className={`int-rail-link${active ? ' on' : ''}`} style={{ textDecoration: 'none' }}>
              {i.label}
            </Link>
          );
        })}
      </nav>

      <div className="int-rail-foot">
        <button
          type="button"
          className="int-signout"
          onClick={() => {
            authService.signOut();
            router.replace('/internal');
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
