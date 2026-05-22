'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type Tab = { id: string; label: string; count?: number };

export function TabStrip({ tabs, defaultTab }: { tabs: Tab[]; defaultTab: string }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get('tab') || defaultTab;

  return (
    <div className="dv-tabs">
      {tabs.map((t) => {
        const isActive = active === t.id;
        const href = `${pathname}?tab=${t.id}`;
        return (
          <Link key={t.id} href={href} className={`tab${isActive ? ' active' : ''}`} style={{ textDecoration: 'none' }}>
            {t.label}
            {t.count != null && <span style={{ opacity: 0.5, marginLeft: 4 }}>· {t.count}</span>}
          </Link>
        );
      })}
    </div>
  );
}
