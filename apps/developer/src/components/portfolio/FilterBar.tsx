'use client';

import { useState } from 'react';

const FILTERS = [
  { id: 'band', label: 'Band' },
  { id: 'status', label: 'Status' },
  { id: 'type', label: 'Type' },
  { id: 'verified', label: 'Last verified' },
  { id: 'expiry', label: 'Expiry' },
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
        <span key={f.id} className="dv-chip">
          {f.label} <span className="caret">▾</span>
        </span>
      ))}
      <span className="spacer" />
      <span className="dv-link">Save view</span>
    </div>
  );
}
