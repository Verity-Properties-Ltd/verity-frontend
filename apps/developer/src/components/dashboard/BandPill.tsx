export type Band = 'platinum' | 'gold' | 'silver' | 'bronze' | 'prov' | 'unconf';

export const BAND_LABELS: Record<Band, string> = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  prov: 'Provisional',
  unconf: 'Unconfirmed',
};

export function BandPill({ band, size }: { band: Band; size?: 'sm' }) {
  return (
    <span className={`dv-band-pill ${band}${size === 'sm' ? ' sm' : ''}`}>
      <span className="dot" />
      {BAND_LABELS[band]}
    </span>
  );
}
