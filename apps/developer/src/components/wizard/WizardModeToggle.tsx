'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function WizardModeToggle() {
  const pathname = usePathname();
  const isCsv = pathname.startsWith('/portfolio/add/csv');
  return (
    <div className="dv-wiz-mode">
      <Link href="/portfolio/add/type" className={`tab${!isCsv ? ' on' : ''}`} style={{ textDecoration: 'none' }}>
        Single property
      </Link>
      <div className="tab" aria-disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
        Batch · up to 25 <span className="ct">FOUNDING 50</span>
      </div>
      <Link href="/portfolio/add/csv" className={`tab${isCsv ? ' on' : ''}`} style={{ textDecoration: 'none' }}>
        CSV import
      </Link>
    </div>
  );
}
