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
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 8,
      }}
    >
      {STYLES.map((s) => {
        const selected = value === s.id;
        const colloquial = APARTMENT_STYLE_TOOLTIP[s.id];
        const tip = colloquial ? `Also known locally as "${colloquial}"` : undefined;
        return (
          <button
            key={s.id}
            type="button"
            className={`bf-card tier${selected ? ' selected' : ''}`}
            onClick={() => onChange(s.id)}
            title={tip}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              padding: '11px 14px',
              minHeight: 48,
              fontSize: 14,
              color: 'var(--navy)',
              fontWeight: selected ? 500 : 400,
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
