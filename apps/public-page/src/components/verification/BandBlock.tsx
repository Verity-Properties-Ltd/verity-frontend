import type { BandTier } from '@/lib/types/verification';

const TIERS: BandTier[] = ['platinum', 'gold', 'silver', 'bronze', 'prov', 'unconf'];
const LABELS = ['PLAT', 'GOLD', 'SILV', 'BRNZ', 'PROV', 'UNCF'];
const NAMES: Record<BandTier, string> = {
  platinum: 'Platinum confidence',
  gold: 'Gold confidence',
  silver: 'Silver confidence',
  bronze: 'Bronze confidence',
  prov: 'Provisional',
  unconf: 'Unconfirmed',
};

export function BandBlock({
  tier = 'gold',
  score = 82,
  clarify,
}: {
  tier?: BandTier;
  score?: number;
  clarify?: string;
}) {
  const idx = TIERS.indexOf(tier);
  return (
    <div className="bf-band-block">
      <div className="band-name">— {NAMES[tier]} —</div>
      <div className="score-row">
        <span className="score">{score}</span>
        <span className="score-of">of 100</span>
      </div>
      <div className="stratum-row">
        {TIERS.map((t, i) => (
          <div key={t} className={`stratum ${i <= idx ? 'fill' : ''}`} />
        ))}
      </div>
      <div className="label-row">
        {LABELS.map((l, i) => (
          <div key={l} className={i === idx ? 'active' : ''}>{l}</div>
        ))}
      </div>
      {clarify && <div className="band-clarify">{clarify}</div>}
    </div>
  );
}
