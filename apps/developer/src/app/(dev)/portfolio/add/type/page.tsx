'use client';

import { useRouter } from 'next/navigation';
import { WizardCard } from '@/components/wizard/WizardCard';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { useAddPropertyDraft } from '@/lib/hooks/useAddPropertyDraft';
import type { PropertyKind } from '@/lib/types/add';

const KIND_OPTIONS: { id: PropertyKind; label: string }[] = [
  { id: 'land', label: 'Land' },
  { id: 'apartment', label: 'Apartment' },
  { id: 'villa', label: 'Villa' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'mixed-use', label: 'Mixed-use' },
];

export default function TypeStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useAddPropertyDraft();

  function setProp<K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) {
    update({ [k]: v } as Partial<typeof draft>);
  }

  const valid = !!draft.kind && !!draft.address.trim() && !!draft.lga.trim() && !!draft.sizeSqm;

  function onContinue() {
    if (!valid) return;
    router.push('/portfolio/add/documents');
  }

  return (
    <WizardCard
      slug="type"
      title={<>Where is <em>this property</em> and what is it?</>}
      lede="Address as it would appear on a Certificate of Occupancy. Size in square metres."
    >
      <div className="dv-form" style={{ marginTop: 24 }}>
        <div className="dv-field full">
          <label className="lbl">Property type</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {KIND_OPTIONS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setProp('kind', k.id)}
                className={`dv-chip${draft.kind === k.id ? ' active' : ''}`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dv-field full">
          <label className="lbl" htmlFor="address">Property address</label>
          <input
            id="address"
            className="dv-input"
            placeholder="Lekki Block A · Plot 12, Lekki Phase II"
            value={draft.address}
            onChange={(e) => setProp('address', e.target.value)}
          />
        </div>

        <div className="row">
          <div className="dv-field">
            <label className="lbl">State</label>
            <div className="dv-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Lagos State</span>
              <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)' }}>NG-LA</span>
            </div>
          </div>
          <div className="dv-field">
            <label className="lbl" htmlFor="lga">Local Government Area</label>
            <input
              id="lga"
              className="dv-input"
              placeholder="Eti-Osa"
              value={draft.lga}
              onChange={(e) => setProp('lga', e.target.value)}
            />
          </div>
        </div>

        <div className="dv-field full">
          <label className="lbl" htmlFor="sizeSqm">Size (sqm)</label>
          <input
            id="sizeSqm"
            className="dv-input mono"
            type="number"
            placeholder="1250"
            value={draft.sizeSqm ?? ''}
            onChange={(e) => setProp('sizeSqm', e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </div>

      <WizardFooter
        primary={{
          label: <>Continue · documents <span className="arrow">→</span></>,
          onClick: onContinue,
          disabled: !hydrated || !valid,
        }}
      />
    </WizardCard>
  );
}
