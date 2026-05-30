'use client';

import {
  LOT_SIZE_SOURCE_LABEL,
  toSquareMeters,
  type RESO_AreaUnits,
  type RESO_LotSizeSource,
  type UICategory,
} from '@verity/reso';

export type LotSizeFields = {
  LotSizeArea: number | null;
  LotSizeUnits: RESO_AreaUnits | null;
  LotSizeDimensions: string;
  LotSizeSource: RESO_LotSizeSource | null;
};

const UNIT_OPTIONS: RESO_AreaUnits[] = ['SquareMeters', 'Hectares', 'Acres'];
const SOURCE_OPTIONS: RESO_LotSizeSource[] = [
  'Survey', 'Assessor', 'PublicRecords', 'Builder', 'Owner', 'Estimated', 'Other',
];

export function LotSizeSection({
  category,
  value,
  onChange,
}: {
  category: UICategory | null;
  value: LotSizeFields;
  onChange: (patch: Partial<LotSizeFields>) => void;
}) {
  // §4 matrix — Apartment has no lot (building association owns the land).
  if (category === 'ApartmentFlat') return null;

  const heading = category === 'LandedProperty' ? 'Lot Size' : 'Plot Size';
  const normalizedSqm =
    value.LotSizeArea && value.LotSizeUnits && value.LotSizeUnits !== 'SquareMeters'
      ? toSquareMeters(value.LotSizeArea, value.LotSizeUnits)
      : null;

  return (
    <section>
      <SectionLabel>{heading}</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="row">
          <div className="dv-field">
            <label className="lbl" htmlFor="lotSizeArea">
              Area <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id="lotSizeArea"
              className="dv-input mono"
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="600"
              value={value.LotSizeArea ?? ''}
              onChange={(e) => {
                const next = e.target.value ? Number(e.target.value) : null;
                // Default units to SquareMeters once the user starts entering (§8 UX).
                onChange({
                  LotSizeArea: next,
                  LotSizeUnits: value.LotSizeUnits ?? (next != null ? 'SquareMeters' : null),
                });
              }}
            />
          </div>
          <div className="dv-field">
            <label className="lbl" htmlFor="lotSizeUnits">
              Units <span className="req" aria-hidden="true">*</span>
            </label>
            <select
              id="lotSizeUnits"
              className="dv-input"
              value={value.LotSizeUnits ?? 'SquareMeters'}
              onChange={(e) => onChange({ LotSizeUnits: e.target.value as RESO_AreaUnits })}
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>{UNIT_LABEL[u]}</option>
              ))}
            </select>
          </div>
        </div>

        {normalizedSqm != null && (
          <div className="dv-field-note">
            ≈ {normalizedSqm.toLocaleString()} sqm (normalized)
          </div>
        )}

        <div className="dv-field full">
          <label className="lbl" htmlFor="lotSizeDimensions">
            Dimensions <span className="opt">(optional)</span>
          </label>
          <input
            id="lotSizeDimensions"
            className="dv-input"
            placeholder="30m × 20m"
            value={value.LotSizeDimensions}
            onChange={(e) => onChange({ LotSizeDimensions: e.target.value })}
          />
        </div>

        <div className="dv-field full">
          <label className="lbl" htmlFor="lotSizeSource">
            Source <span className="req" aria-hidden="true">*</span>
          </label>
          <select
            id="lotSizeSource"
            className="dv-input"
            value={value.LotSizeSource ?? ''}
            onChange={(e) =>
              onChange({ LotSizeSource: (e.target.value || null) as RESO_LotSizeSource | null })
            }
          >
            <option value="">Select a source…</option>
            {SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s} title={LOT_SIZE_SOURCE_LABEL[s]}>
                {SOURCE_DISPLAY[s]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

const UNIT_LABEL: Record<RESO_AreaUnits, string> = {
  SquareMeters: 'Square Meters (sqm)',
  Hectares:     'Hectares (ha)',
  Acres:        'Acres',
  SquareFeet:   'Square Feet (sqft)',
};

const SOURCE_DISPLAY: Record<RESO_LotSizeSource, string> = {
  Survey:        'Survey',
  Assessor:      'Assessor',
  PublicRecords: 'Public records (C of O)',
  Builder:       'Builder / Developer',
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
