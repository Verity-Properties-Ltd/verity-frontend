'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHead } from '@dev/components/chrome/PageHead';
import { FilterBar } from '@dev/components/portfolio/FilterBar';
import { PortfolioTable } from '@dev/components/portfolio/PortfolioTable';
import { Pager } from '@dev/components/portfolio/Pager';
import { EmptyState } from '@dev/components/portfolio/EmptyState';
import { propertyService } from '@dev/lib/services';
import type { PropertySummary } from '@dev/lib/types/property';

export function PortfolioClient() {
  const [properties, setProperties] = useState<PropertySummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    propertyService.list().then((p) => { if (!cancelled) setProperties(p); });
    return () => { cancelled = true; };
  }, []);

  function toggleEmpty() {
    const next = !propertyService.isEmptyMode();
    propertyService.setEmptyMode(next);
    propertyService.list().then(setProperties);
  }

  if (properties === null) {
    return <p style={{ color: 'var(--slate)' }}>Loading portfolio…</p>;
  }

  if (properties.length === 0) {
    return (
      <>
        <EmptyState />
        <div style={{ marginTop: 16, fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Demo · {' '}
          <button type="button" onClick={toggleEmpty} style={{ background: 'transparent', border: 0, padding: 0, color: 'var(--gold-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', borderBottom: '1px solid var(--gold)' }}>
            seed portfolio with 12 properties
          </button>
        </div>
      </>
    );
  }

  const total = 87; // What the Lekki Heights account would have in production
  return (
    <>
      <PageHead
        eyebrow={`${total} properties · Lagos State`}
        title={<><em>Portfolio</em></>}
        lede="Sort, filter, and refresh verifications across your entire holding. Bulk actions available on selection."
        actions={
          <>
            <button type="button" className="dv-btn outline">Export CSV</button>
            <Link href="/developer/portfolio/add/type" className="dv-btn primary">
              Add property <span className="arrow">→</span>
            </Link>
          </>
        }
      />

      <FilterBar totalCount={total} />

      <div style={{ marginTop: 18 }}>
        <PortfolioTable properties={properties} />
        <Pager shown={properties.length} total={total} pages={Math.ceil(total / 12)} activePage={1} />
      </div>

      <div style={{ marginTop: 16, fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        Mock data ·{' '}
        <button type="button" onClick={toggleEmpty} style={{ background: 'transparent', border: 0, padding: 0, color: 'var(--gold-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', borderBottom: '1px solid var(--gold)' }}>
          show empty state
        </button>
      </div>
    </>
  );
}
