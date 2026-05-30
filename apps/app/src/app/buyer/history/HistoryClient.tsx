'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar } from '@/components/chrome/AppBar';
import { BuyerTabs } from '@/components/chrome/BuyerTabs';
import { requestService, authService } from '@/lib/services';
import { RequestRow } from '@/components/dashboard/RequestRow';
import type { RequestSummary } from '@/lib/types/request';

export function HistoryClient() {
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const initial = (typeof window !== 'undefined' ? authService.getSession()?.fullName.charAt(0).toUpperCase() : null) || 'A';

  useEffect(() => {
    let cancelled = false;
    requestService.list().then((all) => {
      if (cancelled) return;
      setRequests(all.filter((r) => r.status === 'complete'));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

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
        <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— History</div>
        <h1 className="bf-page-h1">
          {loading
            ? 'Loading…'
            : requests.length === 0
              ? <>No <em className="bf-italic">completed</em> verifications yet.</>
              : requests.length === 1
                ? <>One <em className="bf-italic">completed</em> verification.</>
                : <><em className="bf-italic">{requests.length}</em> completed verifications.</>}
        </h1>

        {requests.length > 0 ? (
          <div className="bf-stack bf-req-list" style={{ marginTop: 24 }}>
            {requests.map((r) => <RequestRow key={r.vpid} r={r} />)}
          </div>
        ) : !loading ? (
          <p className="bf-small" style={{ marginTop: 14, maxWidth: 480 }}>
            Once a verification finishes, the certificate lives here for 12 months. Active requests stay on the dashboard.
          </p>
        ) : null}

        <div style={{ marginTop: 32 }}>
          <Link href="/buyer/request/new/property" className="bf-btn outline" style={{ width: 'auto', minWidth: 240, textDecoration: 'none' }}>
            Start a new verification
          </Link>
        </div>
      </div>
    </>
  );
}
