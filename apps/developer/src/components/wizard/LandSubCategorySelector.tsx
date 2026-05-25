'use client';

import {
  UI_LAND_SUBCATEGORY_LABEL,
  type UILandSubCategory,
  type VerityNG_LandFeature,
} from '@verity/reso';

const SUBS: { id: UILandSubCategory; tip: string }[] = [
  { id: 'ResidentialPlot',  tip: 'Zoned for housing' },
  { id: 'CommercialPlot',   tip: 'Office / retail use' },
  { id: 'MixedUsePlot',     tip: 'Combined residential + commercial' },
  { id: 'IndustrialPlot',   tip: 'Factory / warehouse' },
  { id: 'AgriculturalPlot', tip: 'Farmland' },
];

const FEATURES: { id: VerityNG_LandFeature; label: string; tip: string }[] = [
  { id: 'Waterfront', label: 'Waterfront', tip: 'Direct frontage on a lagoon, river, or coastline' },
  { id: 'Reclaimed',  label: 'Reclaimed',  tip: 'Reclaimed land — typically Lekki / Eko Atlantic style' },
];

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
    onFeaturesChange(isOn ? features.filter((x) => x !== f) : [...features, f]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 8,
        }}
      >
        {SUBS.map((s) => {
          const selected = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              title={s.tip}
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
              {UI_LAND_SUBCATEGORY_LABEL[s.id]}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FEATURES.map((f) => {
            const on = features.includes(f.id);
            return (
              <CheckRow key={f.id} checked={on} onChange={() => toggleFeature(f.id)} label={f.label} title={f.tip} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  title,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  title?: string;
}) {
  return (
    <label
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        background: '#fff',
        border: checked ? '1px solid var(--gold)' : '1px solid var(--line)',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 14,
        color: 'var(--navy)',
        width: 'fit-content',
        minWidth: 220,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ width: 16, height: 16, accentColor: 'var(--navy)' }}
      />
      {label}
    </label>
  );
}
