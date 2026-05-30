'use client';

import { usePathname } from 'next/navigation';
import { useRequestDraft } from '@/lib/hooks/useRequestDraft';
import { TIER_LABEL, TIER_PRICE } from '@/lib/types/request';

const STEPS = ['property', 'documents', 'tier', 'payment', 'confirmed'] as const;

function stepIndex(pathname: string): number {
  const seg = pathname.split('/').filter(Boolean).pop();
  const i = STEPS.indexOf(seg as (typeof STEPS)[number]);
  return i >= 0 ? i : 0;
}

export function RequestSidebar() {
  const pathname = usePathname();
  const { draft, hydrated } = useRequestDraft();
  const step = stepIndex(pathname);

  const summary = [
    {
      label: 'Property',
      value: hydrated && draft.property.streetAddressInput
        ? draft.property.streetAddressInput
        : '—',
    },
    {
      label: 'Documents',
      value: hydrated
        ? draft.noDocuments
          ? 'None — Bronze cap'
          : draft.documents.length > 0
            ? `${draft.documents.length} file${draft.documents.length === 1 ? '' : 's'}`
            : '—'
        : '—',
    },
    {
      label: 'Tier',
      value: hydrated && draft.tier
        ? `${TIER_LABEL[draft.tier]} · ₦${TIER_PRICE[draft.tier].toLocaleString()}`
        : '—',
    },
  ];

  return (
    <div>
      <div className="bf-eyebrow slate" style={{ marginBottom: 14 }}>— Request summary</div>
      <div className="bf-stack" style={{ gap: 14 }}>
        {summary.map((s, i) => (
          <div key={s.label} className={`bf-summary-row ${i < step ? 'done' : i === step ? 'current' : ''}`}>
            <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>
              {s.label.toUpperCase()}
            </div>
            <div className="bf-body" style={{ fontSize: 14, marginTop: 2, color: i <= step ? 'var(--navy)' : 'var(--slate)' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
