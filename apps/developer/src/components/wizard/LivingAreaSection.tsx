'use client';

import {
  LIVING_AREA_SOURCE_LABEL,
  type RESO_LivingAreaSource,
  type UICategory,
} from '@verity/reso';

export type LivingAreaFields = {
  LivingArea: number | null;
  LivingAreaSource: RESO_LivingAreaSource | null;
};

const SOURCE_OPTIONS: RESO_LivingAreaSource[] = [
  'Appraiser', 'Plans', 'Builder', 'Assessor', 'PublicRecords', 'Owner', 'Estimated', 'Other',
];

export function LivingAreaSection({
  category,
  value,
  onChange,
}: {
  category: UICategory | null;
  value: LivingAreaFields;
  onChange: (patch: Partial<LivingAreaFields>) => void;
}) {
  // §4 matrix — Land has no living area.
  if (category === 'LandedProperty') return null;
  if (category !== 'ResidentialHouse' && category !== 'ApartmentFlat') return null;

  return (
    <section>
      <SectionLabel>Living Area</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="dv-field full">
          <label className="lbl" htmlFor="livingArea">Area (m²)</label>
          <input
            id="livingArea"
            className="dv-input mono"
            type="number"
            placeholder="380"
            value={value.LivingArea ?? ''}
            onChange={(e) =>
              onChange({ LivingArea: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>

        <div className="dv-field full">
          <label className="lbl" htmlFor="livingAreaSource">Source</label>
          <select
            id="livingAreaSource"
            className="dv-input"
            value={value.LivingAreaSource ?? ''}
            onChange={(e) =>
              onChange({
                LivingAreaSource: (e.target.value || null) as RESO_LivingAreaSource | null,
              })
            }
          >
            <option value="">Select a source…</option>
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s} title={LIVING_AREA_SOURCE_LABEL[s]}>
                {SOURCE_DISPLAY[s]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

const SOURCE_DISPLAY: Record<RESO_LivingAreaSource, string> = {
  Appraiser:     'Appraiser',
  Plans:         'Building plans',
  Builder:       'Builder / Developer',
  Assessor:      'Assessor',
  PublicRecords: 'Public records',
  Owner:         'Owner',
  Estimated:     'Estimated',
  Other:         'Other',
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--f-meta)',
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--gold-deep)',
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}
