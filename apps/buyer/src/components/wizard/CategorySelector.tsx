'use client';

import { UI_CATEGORY_LABEL, UI_CATEGORY_PHASE2, type UICategory } from '@/lib/types/reso';

const CATEGORIES: { id: UICategory; sub: string }[] = [
  { id: 'LandedProperty',   sub: 'Plots — residential, commercial, mixed-use, industrial, agricultural' },
  { id: 'ResidentialHouse', sub: 'Bungalow · Duplex · Terrace — single-family ownership' },
  { id: 'ApartmentFlat',    sub: 'Studio · Flat · Penthouse · Maisonette' },
  { id: 'Commercial',       sub: 'Office · Retail · Warehouse' },
  { id: 'Farm',             sub: 'Active farm with operations' },
];

export function CategorySelector({
  value,
  onChange,
}: {
  value: UICategory | null;
  onChange: (next: UICategory) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}
    >
      {CATEGORIES.map((c) => {
        const selected = value === c.id;
        const disabled = UI_CATEGORY_PHASE2.has(c.id);
        return (
          <button
            key={c.id}
            type="button"
            className={`bf-card tier${selected ? ' selected' : ''}`}
            onClick={() => !disabled && onChange(c.id)}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            title={disabled ? 'Phase 2 — coming in MVP+1' : undefined}
            style={{
              textAlign: 'left',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.55 : 1,
              minHeight: 96,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              className="bf-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: selected ? 'var(--gold-deep)' : 'var(--slate)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <span>— {UI_CATEGORY_LABEL[c.id]}</span>
              {disabled && <span style={{ color: 'var(--slate)', letterSpacing: '0.18em' }}>PHASE 2</span>}
            </div>
            <div className="bf-body" style={{ fontSize: 14, color: 'var(--navy)', lineHeight: 1.4 }}>
              {c.sub}
            </div>
          </button>
        );
      })}
    </div>
  );
}
