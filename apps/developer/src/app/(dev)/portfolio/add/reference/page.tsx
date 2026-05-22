'use client';

import { useRouter } from 'next/navigation';
import { WizardCard } from '@/components/wizard/WizardCard';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { useAddPropertyDraft } from '@/lib/hooks/useAddPropertyDraft';

export default function ReferenceStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useAddPropertyDraft();
  const valid = draft.ref.trim().length >= 2;

  return (
    <WizardCard
      slug="reference"
      title={<>Give it an <em>internal reference</em>.</>}
      lede="A short identifier you'll use in your own systems. We'll display it next to the VPID on all internal screens."
    >
      <div className="dv-form" style={{ marginTop: 24 }}>
        <div className="dv-field full">
          <label className="lbl" htmlFor="ref">Internal reference</label>
          <input
            id="ref"
            className="dv-input mono"
            placeholder="LKI-A-12"
            value={draft.ref}
            onChange={(e) => update({ ref: e.target.value.toUpperCase() })}
            maxLength={32}
          />
          <div className="help">Letters, numbers, dashes. Up to 32 characters.</div>
        </div>
      </div>

      <WizardFooter
        back={{ href: '/portfolio/add/documents', label: 'Back to documents' }}
        primary={{
          label: <>Continue · tier <span className="arrow">→</span></>,
          onClick: () => router.push('/portfolio/add/tier'),
          disabled: !hydrated || !valid,
        }}
      />
    </WizardCard>
  );
}
