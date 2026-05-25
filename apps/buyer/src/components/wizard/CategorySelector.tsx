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
            className={`bf-card tier${selected ? ' selected' : ''}`}
            onClick={() => !disabled && onChange(c.id)}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            title={disabled ? 'Coming in MVP+1' : c.tip}
            style={{
              textAlign: 'left',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.55 : 1,
              padding: '12px 14px',
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
              <span className="bf-body" style={{ fontSize: 14, color: 'var(--navy)', fontWeight: selected ? 500 : 400 }}>
                {UI_CATEGORY_LABEL[c.id]}
              </span>
              {disabled && (
                <span
                  className="bf-mono"
                  style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em' }}
                >
                  PHASE 2
                </span>
              )}
            </div>
            {disabled && (
              <div className="bf-body" style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.4 }}>
                {c.tip}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
