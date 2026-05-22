import type { FoundingStatus } from '@/lib/types/account';

export function FoundingCard({ status }: { status: FoundingStatus }) {
  return (
    <div className="dv-founding-card">
      <div className="label">Founding 50</div>
      <div className="h">{status.cohort}</div>
      <div style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 14, color: 'rgba(245,242,237,0.7)', marginTop: 8, lineHeight: 1.5 }}>
        You are one of fifty Lagos-based developers building VERITY&rsquo;s foundational verification corpus.
      </div>
      <div className="kv">
        <div>
          <div className="k">Admitted</div>
          <div className="v">{status.admittedAt}</div>
        </div>
        <div>
          <div className="k">Cohort number</div>
          <div className="v gold">{status.cohortNumber}</div>
        </div>
        <div>
          <div className="k">Free until</div>
          <div className="v">{status.freeUntil}</div>
        </div>
        <div>
          <div className="k">Advisor</div>
          <div className="v">{status.advisor.name}</div>
        </div>
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(245,242,237,0.12)' }}>
        <div style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'rgba(245,242,237,0.5)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 6 }}>
          Direct line
        </div>
        <div style={{ fontFamily: 'var(--f-meta)', fontSize: 12, color: 'var(--cream)' }}>{status.advisor.email}</div>
        <div style={{ fontFamily: 'var(--f-meta)', fontSize: 12, color: 'var(--cream)', marginTop: 2 }}>{status.advisor.phone}</div>
      </div>
      <button type="button" className="dv-btn gold sm" style={{ marginTop: 18, width: '100%', justifyContent: 'center' }}>
        Schedule a call
      </button>
    </div>
  );
}
