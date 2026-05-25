'use client';

import { APARTMENT_STYLE_TOOLTIP, type VerityNG_ApartmentStyle } from '@verity/reso';

const STYLES: { id: VerityNG_ApartmentStyle; label: string }[] = [
  { id: 'Studio',       label: 'Studio' },
  { id: 'StandardFlat', label: 'Standard Flat' },
  { id: 'Penthouse',    label: 'Penthouse' },
  { id: 'Maisonette',   label: 'Maisonette' },
];

const BEDROOM_CHIPS: { value: number; label: string }[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5+' },
];

export function ApartmentStyleSelector({
  value,
  onChange,
  bedrooms,
  onBedroomsChange,
}: {
  value: VerityNG_ApartmentStyle | null;
  onChange: (next: VerityNG_ApartmentStyle) => void;
  bedrooms: number | null;
  onBedroomsChange: (next: number) => void;
}) {
  const showsBedrooms = value !== null && value !== 'Studio';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              onClick={() => onChange(s.id)}
              title={tip}
              style={{
                background: '#fff',
                border: selected ? '1px solid var(--gold)' : '1px solid var(--line)',
                boxShadow: selected ? '0 0 0 1px var(--gold) inset' : undefined,
                padding: '11px 14px',
                borderRadius: 6,
                textAlign: 'left',
                cursor: 'pointer',
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

      {showsBedrooms && (
        <div>
          <div
            style={{
              fontFamily: 'var(--f-meta)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--slate)',
              marginBottom: 8,
            }}
          >
            Bedrooms
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {BEDROOM_CHIPS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => onBedroomsChange(b.value)}
                className={`dv-chip${bedrooms === b.value ? ' active' : ''}`}
                style={{ minWidth: 44, justifyContent: 'center' }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
