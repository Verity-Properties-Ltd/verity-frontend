import type { RequestDetail } from '@/lib/types/request';
import { TIER_LABEL, TIER_PRICE } from '@/lib/types/request';
import { BandPill } from '@/components/verification/BandPill';
import type { BandTier } from '@/lib/types/verification';

export function StatusHead({
  request,
  pillTier,
}: {
  request: RequestDetail;
  pillTier: BandTier;
}) {
  const [first, ...restParts] = request.address.split(',');
  const rest = restParts.join(',').trim();
  return (
    <header style={{ marginBottom: 24 }}>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— {request.vpid.toUpperCase()}</div>
      <h2 className="bf-h2">
        {first.trim()}
        <br />
        <em className="bf-italic" style={{ fontSize: 18 }}>{rest ? `${rest}.` : `${request.city}.`}</em>
      </h2>
      <div className="bf-row" style={{ gap: 10, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <BandPill tier={pillTier} />
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.16em' }}>
          {TIER_LABEL[request.tier].toUpperCase()} · ₦{TIER_PRICE[request.tier].toLocaleString()}
        </span>
      </div>
    </header>
  );
}
