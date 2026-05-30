import type { BandTier } from '@/lib/types/verification';

const NAMES: Record<BandTier, string> = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  prov: 'Provisional',
  unconf: 'Unconfirmed',
};

export function BandPill({ tier = 'gold', score }: { tier?: BandTier; score?: number }) {
  return (
    <span className={`bf-band ${tier}`}>
      <span className="dot" />
      <span>
        {NAMES[tier]}
        {score != null && score > 0 ? ` · ${score}` : ''}
      </span>
    </span>
  );
}
