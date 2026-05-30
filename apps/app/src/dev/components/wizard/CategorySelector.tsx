'use client';

import { UI_CATEGORY_LABEL, UI_CATEGORY_PHASE2, type UICategory } from '@verity/reso';

const CATEGORIES: { id: UICategory; tip: string }[] = [
  { id: 'LandedProperty',   tip: 'Plots — residential, commercial, mixed-use, industrial, agricultural' },
  { id: 'ResidentialHouse', tip: 'Bungalow · Duplex · Terrace — single-family ownership' },
  { id: 'ApartmentFlat',    tip: 'Studio · Flat · Penthouse · Maisonette' },
  { id: 'Commercial',       tip: 'Office · Retail · Warehouse' },
  { id: 'Farm',             tip: 'Active farm with operations' },
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 10,
      }}
    >
      {CATEGORIES.map((c) => {
        const selected = value === c.id;
        const disabled = UI_CATEGORY_PHASE2.has(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => !disabled && onChange(c.id)}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            title={disabled ? 'Coming in MVP+1' : c.tip}
            style={{
              background: '#fff',
              border: selected ? '1px solid var(--gold)' : '1px solid var(--line)',
              boxShadow: selected ? '0 0 0 1px var(--gold) inset' : undefined,
              padding: '12px 14px',
              borderRadius: 6,
              textAlign: 'left',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.55 : 1,
              minHeight: disabled ? 72 : 56,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: selected ? 'var(--navy)' : 'var(--navy)',
                  fontWeight: selected ? 500 : 400,
                }}
              >
                {UI_CATEGORY_LABEL[c.id]}
              </span>
              {disabled && (
                <span
                  style={{
                    fontFamily: 'var(--f-meta)',
                    fontSize: 9,
                    color: 'var(--slate)',
                    letterSpacing: '0.18em',
                  }}
                >
                  PHASE 2
                </span>
              )}
            </div>
            {disabled && (
              <div style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.4 }}>
                {c.tip}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
