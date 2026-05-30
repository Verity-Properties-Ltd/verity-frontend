'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHead } from '@dev/components/chrome/PageHead';
import { KpiCard } from '@dev/components/dashboard/KpiCard';
import { BandBreakdownBar } from '@dev/components/dashboard/BandBreakdownBar';
import { DistributionSparkline } from '@dev/components/dashboard/DistributionSparkline';
import { AttentionList } from '@dev/components/dashboard/AttentionList';
import { ActivityFeed } from '@dev/components/dashboard/ActivityFeed';
import { QuickActions } from '@dev/components/dashboard/QuickActions';
import { propertyService } from '@dev/lib/services';
import type { DashboardSnapshot } from '@dev/lib/types/property';

function greetingFor(d: Date) {
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function VerifiedDashboard({ name }: { name: string }) {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const firstName = name.split(' ')[0];
  const now = new Date();
  const greeting = greetingFor(now);
  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    let cancelled = false;
    propertyService.getDashboardSnapshot().then((s) => {
      if (!cancelled) setSnapshot(s);
    });
    return () => { cancelled = true; };
  }, []);

  if (!snapshot) {
    return <p className="dv-prove-desc" style={{ color: 'var(--slate)' }}>Loading dashboard…</p>;
  }

  const { kpis, bands, attention, activity, sparkline } = snapshot;

  return (
    <>
      <PageHead
        eyebrow={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span>{dateLabel}</span>
            <span className="dv-verified-strip">
              <span className="dot" />
              Company verified
              <span className="ref">Mono</span>
            </span>
          </span>
        }
        title={<>{greeting}, <em>{firstName}</em>.</>}
        lede={`${kpis.inVerification} properties are mid-verification. ${kpis.expiringSoon} verifications expire in the next ninety days.`}
        actions={
          <>
            <Link href="/activity" className="dv-btn outline">View activity</Link>
            <Link href="/developer/portfolio/add/type" className="dv-btn primary">
              Add a property <span className="arrow">→</span>
            </Link>
          </>
        }
      />

      <div className="dv-kpi-grid">
        <KpiCard
          label="Portfolio · total"
          value={kpis.total}
          delta={`+ ${kpis.added} added this quarter`}
          deltaKind="up"
        />
        <KpiCard
          label="In verification"
          value={kpis.inVerification}
          delta={kpis.inVerificationBreakdown}
        />
        <KpiCard
          label="Expiring · 90 days"
          value={kpis.expiringSoon}
          delta="Refresh available"
          deltaKind="warn"
        />
        <KpiCard
          label="Distribution · MTD"
          value={kpis.distributionViewsMtd.toLocaleString()}
          unit="views"
          delta={`+ ${kpis.distributionDeltaPct}% on April`}
          deltaKind="up"
        />
      </div>

      <div className="dv-blocks">
        <div className="dv-block">
          <div className="dv-block-head">
            <h3>Confidence band breakdown</h3>
            <span className="meta">{kpis.total} properties · refreshed 06:00 WAT</span>
          </div>
          <BandBreakdownBar bands={bands} />

          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
            <div className="dv-block-head" style={{ borderBottom: 'none', marginBottom: 12, paddingBottom: 0 }}>
              <h3 style={{ fontSize: 12 }}>Distribution · last 30 days</h3>
              <span className="meta">verity.properties/v/* · public views</span>
            </div>
            <DistributionSparkline values={sparkline} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              <span>13 Apr</span><span>27 Apr</span><span>11 May</span>
            </div>
          </div>
        </div>

        <div className="dv-block">
          <div className="dv-block-head">
            <h3>Needs your attention</h3>
            <span className="meta">{attention.length} items</span>
          </div>
          <AttentionList items={attention} />
        </div>

        <div className="dv-block full">
          <div className="dv-block-head">
            <h3>Recent activity · last 7 days</h3>
            <span className="meta">
              <a href="#" style={{ color: 'var(--slate)', borderBottom: '1px solid var(--line)', paddingBottom: 1, textDecoration: 'none' }}>
                View all activity →
              </a>
            </span>
          </div>
          <ActivityFeed events={activity} />
        </div>
      </div>

      <QuickActions />
    </>
  );
}
