'use client';

import { useRouter } from 'next/navigation';
import { useRequestDraft } from '@/lib/hooks/useRequestDraft';
import type { PropertyType } from '@/lib/types/request';
import { WizardFooter } from '@/components/wizard/WizardFooter';

const TYPES: { id: PropertyType; label: string }[] = [
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'mixed-use', label: 'Mixed-use' },
  { id: 'land', label: 'Land' },
];

export default function PropertyStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useRequestDraft();
  const p = draft.property;
  const valid = !!p.type && !!p.lga.trim() && !!p.address.trim();

  function setProp<K extends keyof typeof p>(key: K, value: (typeof p)[K]) {
    update((d) => ({ ...d, property: { ...d.property, [key]: value } }));
  }

  function onContinue() {
    if (!valid) return;
    router.push('/request/new/documents');
  }

  return (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Property details</div>
      <h2 className="bf-h2">
        Tell us about <em className="bf-italic">the property</em> you want verified.
      </h2>

      <div className="bf-stack" style={{ gap: 18, marginTop: 24, maxWidth: 720 }}>
        <div className="bf-field">
          <label className="bf-label">Property type *</label>
          <div className="bf-seg">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={p.type === t.id ? 'on' : ''}
                onClick={() => setProp('type', t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bf-grid-2">
          <div className="bf-field">
            <label className="bf-label">State *</label>
            <div className="bf-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Lagos State</span>
              <span className="bf-mono" style={{ color: 'var(--slate)', fontSize: 10 }}>NG-LA</span>
            </div>
          </div>
          <div className="bf-field">
            <label className="bf-label" htmlFor="lga">Local Government Area *</label>
            <input
              id="lga"
              className="bf-input"
              value={p.lga}
              placeholder="Eti-Osa"
              onChange={(e) => setProp('lga', e.target.value)}
            />
          </div>
        </div>

        <div className="bf-field">
          <label className="bf-label" htmlFor="address">Plot address *</label>
          <textarea
            id="address"
            className="bf-textarea"
            value={p.address}
            placeholder="Plot 27B, Admiralty Way, Lekki Phase 1, Lagos."
            onChange={(e) => setProp('address', e.target.value)}
          />
        </div>

        <div className="bf-grid-2">
          <div className="bf-field">
            <label className="bf-label" htmlFor="plotNo">
              Plot no. <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span>
            </label>
            <input
              id="plotNo"
              className="bf-input mono"
              value={p.plotNo || ''}
              placeholder="LEK/PH1/27B"
              onChange={(e) => setProp('plotNo', e.target.value)}
            />
          </div>
          <div className="bf-field">
            <label className="bf-label" htmlFor="sizeSqm">
              Size (sqm) <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span>
            </label>
            <input
              id="sizeSqm"
              className="bf-input mono"
              type="number"
              value={p.sizeSqm ?? ''}
              placeholder="640"
              onChange={(e) => setProp('sizeSqm', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>

      <WizardFooter
        primary={{
          label: <>Continue <span className="arrow">→</span></>,
          onClick: onContinue,
          disabled: !hydrated || !valid,
        }}
      />
    </>
  );
}
