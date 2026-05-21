import Link from 'next/link';
import type { RequestSummary, Tier } from '@/lib/types/request';
import { BandPill } from '@/components/verification/BandPill';
import type { BandTier } from '@/lib/types/verification';

const STATUS_LABEL: Record<RequestSummary['status'], string> = {
  'in-progress': 'In progress',
  'awaiting-action': 'Awaiting you',
  'complete': 'Complete',
};

function bandFor(status: RequestSummary['status'], tier: Tier): BandTier {
  if (status === 'complete') return tier === 'standard' ? 'bronze' : 'gold';
  if (status === 'awaiting-action') return 'unconf';
  return 'prov';
}

export function RequestRow({ r, showStage }: { r: RequestSummary; showStage?: { stage: number; total: number } }) {
  return (
    <Link href={`/requests/${r.vpid}`} className="bf-req" style={{ textDecoration: 'none' }}>
      <div>
        <div className="addr">
          {r.address}
          {r.city && <>, {r.city}</>}
        </div>
        <div className="vpid">
          <span style={{ textTransform: 'uppercase' }}>{r.vpid}</span> · {r.tier === 'premium' ? 'Premium' : 'Standard'}
        </div>
      </div>
      <div className="right">
        {showStage && (
          <span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>
            STAGE {String(showStage.stage).padStart(2, '0')} / {String(showStage.total).padStart(2, '0')}
          </span>
        )}
        <span className="when">{STATUS_LABEL[r.status]}</span>
        <BandPill tier={bandFor(r.status, r.tier)} />
      </div>
    </Link>
  );
}
