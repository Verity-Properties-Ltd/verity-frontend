'use client';

import { APARTMENT_STYLE_TOOLTIP, type VerityNG_ApartmentStyle } from '@verity/reso';

const STYLES: { id: VerityNG_ApartmentStyle; label: string }[] = [
  { id: 'Studio',       label: 'Studio' },
  { id: 'StandardFlat', label: 'Standard Flat' },
  { id: 'Penthouse',    label: 'Penthouse' },
  { id: 'Maisonette',   label: 'Maisonette' },
];

export function ApartmentStyleSelector({
  value,
  onChange,
}: {
  value: VerityNG_ApartmentStyle | null;
  onChange: (next: VerityNG_ApartmentStyle) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 10,
      }}
    >
      {STYLES.map((s) => {
        const selected = value === s.id;
        const colloquial = APARTMENT_STYLE_TOOLTIP[s.id];
        return (
          <button
            key={s.id}
            type="button"
            className={`bf-card tier${selected ? ' selected' : ''}`}
            onClick={() => onChange(s.id)}
            title={colloquial ? `Also known locally as "${colloquial}"` : undefined}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              minHeight: 72,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span
              className="bf-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: selected ? 'var(--gold-deep)' : 'var(--slate)',
              }}
            >
              — {s.label}
            </span>
            {colloquial && (
              <span className="bf-body" style={{ fontSize: 13, color: 'var(--navy)', lineHeight: 1.4 }}>
                Locally: <em className="bf-italic">{colloquial}</em>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
