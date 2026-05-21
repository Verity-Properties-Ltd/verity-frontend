'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar } from '@/components/chrome/AppBar';
import { BuyerTabs } from '@/components/chrome/BuyerTabs';
import { requestService, authService, verificationService } from '@/lib/services';
import { RequestRow } from '@/components/dashboard/RequestRow';
import type { RequestSummary } from '@/lib/types/request';

const TOTAL_STAGES = 8;

export function DashboardClient() {
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [stages, setStages] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const session = typeof window !== 'undefined' ? authService.getSession() : null;
  const firstName = session?.fullName.split(' ')[0] || 'there';
  const initial = (session?.fullName || 'A').charAt(0).toUpperCase();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await requestService.list();
      if (cancelled) return;
      setRequests(list);
      const inflight = list.filter((r) => r.status !== 'complete');
      const tracks = await Promise.all(
        inflight.map(async (r) => [r.vpid, (await verificationService.getTrack(r.vpid))?.currentStage ?? 0] as const),
      );
      if (cancelled) return;
      setStages(Object.fromEntries(tracks));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const active = requests.filter((r) => r.status !== 'complete');
  const past = requests.filter((r) => r.status === 'complete');

  return (
    <>
      <div className="wizard-mobile-chrome">
        <AppBar
          back={false}
          title="VERITY"
          right={
            <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--navy)', color: 'var(--cream)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 14 }}>
              {initial}
            </span>
          }
        />
        <BuyerTabs />
      </div>

      <div className="bf-main-inner">
        <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Welcome back, {firstName}</div>
        <h1 className="bf-page-h1">
          {loading
            ? 'Loading your verifications…'
            : active.length === 0 && past.length === 0
              ? <>Ready when you <em className="bf-italic">are.</em></>
              : active.length === 1
                ? <>You have <em className="bf-italic">one</em> verification in flight.</>
                : active.length > 1
                  ? <>You have <em className="bf-italic">{active.length}</em> verifications in flight.</>
                  : <>No verifications in flight.</>}
        </h1>

        {active.length > 0 && (
          <>
            <div className="bf-eyebrow slate" style={{ marginTop: 28, marginBottom: 10 }}>— Active</div>
            <div className="bf-stack bf-req-list">
              {active.map((r) => (
                <RequestRow
                  key={r.vpid}
                  r={r}
                  showStage={r.status === 'in-progress' ? { stage: stages[r.vpid] || 0, total: TOTAL_STAGES } : undefined}
                />
              ))}
            </div>
          </>
        )}

        {past.length > 0 && (
          <>
            <div className="bf-eyebrow slate" style={{ marginTop: 32, marginBottom: 10 }}>— Past verifications</div>
            <div className="bf-stack bf-req-list">
              {past.map((r) => (
                <RequestRow key={r.vpid} r={r} />
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: 32 }}>
          <Link href="/request/new/property" className="bf-btn primary" style={{ width: 280, textDecoration: 'none' }}>
            + &nbsp; Start a new verification
          </Link>
        </div>
      </div>
    </>
  );
}
