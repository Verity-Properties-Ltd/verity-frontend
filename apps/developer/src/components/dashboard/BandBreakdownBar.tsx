import type { Band } from './BandPill';
import type { BandTotals } from '@/lib/types/property';

const ORDER: Band[] = ['platinum', 'gold', 'silver', 'bronze', 'prov', 'unconf'];

const LEGEND: { band: Band; label: string; color: string }[] = [
  { band: 'platinum', label: 'Platinum', color: '#5C6BC0' },
  { band: 'gold', label: 'Gold', color: 'var(--gold)' },
  { band: 'silver', label: 'Silver', color: '#9598A0' },
  { band: 'bronze', label: 'Bronze', color: '#B07A4A' },
  { band: 'prov', label: 'Provisional', color: '#C8C0AE' },
  { band: 'unconf', label: 'Unconfirmed', color: 'var(--slate-soft)' },
];

export function BandBreakdownBar({ bands }: { bands: BandTotals }) {
  const total = ORDER.reduce((s, k) => s + bands[k], 0);
  return (
    <>
      <div className="dv-band-bar" role="img" aria-label="Confidence band distribution">
        {ORDER.map((k) => {
          const ct = bands[k];
          if (ct === 0) return null;
          const pct = (ct / total) * 100;
          return (
            <div key={k} className={`seg ${k}`} style={{ width: `${pct}%` }}>
              {pct >= 8 ? ct : ''}
            </div>
          );
        })}
      </div>
      <div className="dv-band-legend">
        {LEGEND.map((l) => (
          <div key={l.band} className="row">
            <span className="dot" style={{ background: l.color }} />
            <span className="name">{l.label}</span>
            <span className="ct">{bands[l.band]}</span>
          </div>
        ))}
      </div>
    </>
  );
}
