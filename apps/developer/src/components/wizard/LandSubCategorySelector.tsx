'use client';

import {
  UI_LAND_SUBCATEGORY_LABEL,
  type UILandSubCategory,
  type VerityNG_LandFeature,
} from '@verity/reso';

const SUBS: { id: UILandSubCategory; hint: string }[] = [
  { id: 'ResidentialPlot',  hint: 'Zoned for housing — RESO: VacantLand' },
  { id: 'CommercialPlot',   hint: 'Office / retail use — RESO: CommercialLand' },
  { id: 'MixedUsePlot',     hint: 'Combined residential + commercial — RESO: VacantLand' },
  { id: 'IndustrialPlot',   hint: 'Factory / warehouse — RESO: CommercialLand' },
  { id: 'AgriculturalPlot', hint: 'Farmland — RESO: AgriculturalLand' },
];

const FEATURES: VerityNG_LandFeature[] = ['Waterfront', 'Reclaimed'];

export function LandSubCategorySelector({
  value,
  onChange,
  features,
  onFeaturesChange,
}: {
  value: UILandSubCategory | null;
  onChange: (next: UILandSubCategory) => void;
  features: VerityNG_LandFeature[];
  onFeaturesChange: (next: VerityNG_LandFeature[]) => void;
}) {
  function toggleFeature(f: VerityNG_LandFeature) {
    const isOn = features.includes(f);
    // Phase 1: single-select. Tapping 'Waterfront' replaces 'Reclaimed' and vice versa.
    onFeaturesChange(isOn ? [] : [f]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 10,
        }}
      >
        {SUBS.map((s) => {
          const selected = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              style={{
                background: '#fff',
                border: selected ? '1px solid var(--gold)' : '1px solid var(--line)',
                boxShadow: selected ? '0 0 0 1px var(--gold) inset' : undefined,
                padding: 12,
                borderRadius: 6,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                minHeight: 76,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--f-meta)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: selected ? 'var(--gold-deep)' : 'var(--slate)',
                }}
              >
                — {UI_LAND_SUBCATEGORY_LABEL[s.id]}
              </span>
              <span style={{ fontSize: 12, color: 'var(--navy)', lineHeight: 1.4 }}>{s.hint}</span>
            </button>
          );
        })}
      </div>

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
          Land features <span style={{ color: 'var(--slate-soft)', marginLeft: 4 }}>· optional</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FEATURES.map((f) => {
            const active = features.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggleFeature(f)}
                className={`dv-chip${active ? ' active' : ''}`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
