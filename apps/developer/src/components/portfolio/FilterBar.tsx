'use client';

import { useState } from 'react';

/**
 * Filter chips — labels are buyer-friendly; the `field` carries the
 * canonical RESO/Verity_NG_* field name that the backend will receive
 * once OData $filter execution lands (brief §9.1).
 */
const FILTERS = [
  { id: 'band',          label: 'Band',           field: 'Verity_BandTier' },
  { id: 'status',        label: 'Status',         field: 'StandardStatus' },
  { id: 'propertyType',  label: 'Property type',  field: 'PropertyType' },
  { id: 'houseStyle',    label: 'House style',    field: 'Verity_NG_HouseStyle' },
  { id: 'landFeature',   label: 'Land feature',   field: 'Verity_NG_LandFeature' },
  { id: 'verified',      label: 'Last verified',  field: 'ModificationTimestamp' },
  { id: 'expiry',        label: 'Expiry',         field: 'Verity_ExpiresAt' },
] as const;

export function FilterBar({ totalCount }: { totalCount: number }) {
  // For Phase 2.B these are UI-only — filtering logic ships when we wire a real backend.
  const [active] = useState<string>('all');

  return (
    <div className="dv-filter-bar">
      <span
        style={{
          fontFamily: 'var(--f-meta)',
          fontSize: 10,
          color: 'var(--slate)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginRight: 8,
        }}
      >
        Filter
      </span>
      <span className={`dv-chip${active === 'all' ? ' active' : ''}`}>
        All <span className="ct">{totalCount}</span>
      </span>
      {FILTERS.map((f) => (
        <span key={f.id} className="dv-chip" title={`RESO field · ${f.field}`}>
          {f.label} <span className="caret">▾</span>
        </span>
      ))}
      <span className="spacer" />
      <span className="dv-link">Save view</span>
    </div>
  );
}
