'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { propertyService } from '@/lib/services';
import type { PropertyDetail } from '@/lib/types/property';
import { PropertyHero } from '@/components/property/PropertyHero';
import { TabStrip } from '@/components/property/TabStrip';
import { VerificationHistory } from '@/components/property/VerificationHistory';
import { DistributionLog } from '@/components/property/DistributionLog';
import { SalesMetadataCard } from '@/components/property/SalesMetadataCard';
import { PublicUrlCard } from '@/components/property/PublicUrlCard';

export function PropertyDetailClient({ vpid }: { vpid: string }) {
  const params = useSearchParams();
  const tab = params.get('tab') || 'overview';
  const [property, setProperty] = useState<PropertyDetail | null | 'loading'>('loading');

  useEffect(() => {
    let cancelled = false;
    propertyService.get(vpid).then((p) => { if (!cancelled) setProperty(p); });
    return () => { cancelled = true; };
  }, [vpid]);

  if (property === 'loading') return <p style={{ color: 'var(--slate)' }}>Loading property…</p>;
  if (property === null) {
    return (
      <div>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 28, color: 'var(--navy)' }}>Property not found</h1>
        <p style={{ color: 'var(--slate)', marginTop: 12 }}>
          The VPID <span style={{ fontFamily: 'var(--f-meta)' }}>{vpid}</span> isn&rsquo;t in your portfolio.
        </p>
        <Link href="/portfolio" className="dv-btn outline" style={{ display: 'inline-flex', marginTop: 16 }}>
          ← Back to portfolio
        </Link>
      </div>
    );
  }

  return (
    <>
      <PropertyHero property={property} />
      <TabStrip
        defaultTab="overview"
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'history', label: 'Verification history', count: property.history.length },
          { id: 'distribution', label: 'Distribution log', count: property.distribution.length },
          { id: 'edit', label: 'Edit metadata' },
        ]}
      />

      <div className="dv-prop">
        <div>
          {(tab === 'overview' || tab === 'history') && (
            <>
              <div className="dv-block-head">
                <h3 style={{ fontFamily: 'var(--f-mark)', fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--navy)', fontWeight: 400, margin: 0 }}>
                  Verification history
                </h3>
                <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em' }}>
                  {property.history.length} events
                </span>
              </div>
              <VerificationHistory events={property.history} />
            </>
          )}

          {(tab === 'overview' || tab === 'distribution') && (
            <div style={{ marginTop: tab === 'overview' ? 40 : 0 }}>
              <div className="dv-block-head">
                <h3 style={{ fontFamily: 'var(--f-mark)', fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--navy)', fontWeight: 400, margin: 0 }}>
                  Distribution log · last 30 days
                </h3>
                <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em' }}>
                  {property.distribution.length} of {property.distribution.length + 146} lifetime
                </span>
              </div>
              <DistributionLog events={property.distribution} />
            </div>
          )}

          {tab === 'edit' && (
            <div style={{ padding: 28, background: 'var(--cream-shade)', border: '1px dashed var(--line-strong)', textAlign: 'center', color: 'var(--slate)' }}>
              Edit metadata UI lands when the backend is wired (Phase 5 / Supabase swap).
            </div>
          )}
        </div>

        <aside>
          <SalesMetadataCard sales={property.sales} />
          <PublicUrlCard vpid={property.vpid} />
        </aside>
      </div>
    </>
  );
}
