'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardCard } from '@/components/wizard/WizardCard';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { useAddPropertyDraft } from '@/lib/hooks/useAddPropertyDraft';
import { propertyService } from '@/lib/services';
import { DOCUMENT_LABELS, type DocumentSlot } from '@/lib/types/add';
import { UI_CATEGORY_LABEL } from '@/lib/types/reso';

export default function ReviewStep() {
  const router = useRouter();
  const { draft, clear, hydrated } = useAddPropertyDraft();
  const [submitting, setSubmitting] = useState(false);

  const docCount = Object.keys(draft.documents).length;
  const categoryLabel = draft.category ? UI_CATEGORY_LABEL[draft.category] : '—';
  const level2 =
    draft.category === 'LandedProperty' ? draft.landSubCategory ?? '—' :
    draft.category === 'ResidentialHouse' ? `${draft.houseStyle ?? '—'} · ${draft.houseAttachment ?? '—'}` :
    draft.category === 'ApartmentFlat' ? draft.apartmentStyle ?? '—' :
    '—';
  const rows: [string, React.ReactNode][] = [
    ['Category', categoryLabel],
    ['Detail',   level2],
    ['Address',  draft.UnparsedAddress || '—'],
    ['State · LGA', `${draft.StateOrProvince} · ${draft.CountyOrParish || '—'}`],
    ['Size',     draft.LotSizeSquareMeters ? `${draft.LotSizeSquareMeters.toLocaleString()} m²` : '—'],
    ['Boys\' Quarters', draft.hasBQ ? `${draft.bqConfig ?? '—'}${draft.bqSeparateTitle ? ' · separate title' : ''}` : 'None'],
    ['Documents', `${docCount} of 4 attached`],
    ['Reference', draft.ref || '—'],
    ['Tier',     draft.tier === 'premium' ? 'Premium · cohort credit' : 'Standard · cohort credit'],
  ];

  async function onSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const { vpid } = await propertyService.submit(draft);
    clear();
    router.push(`/portfolio/${vpid}?just-added=1`);
  }

  return (
    <WizardCard
      slug="review"
      title={<>Review and <em>submit</em>.</>}
      lede="Once you submit, we'll start the verification workflow. You'll receive an email when each stage completes."
    >
      <div style={{ marginTop: 20, border: '1px solid var(--line)', background: '#fff' }}>
        {rows.map(([k, v], i) => (
          <div key={k} style={{ padding: '14px 18px', borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>{k}</span>
            <span style={{ fontSize: 13, color: 'var(--navy)', textAlign: 'right' }}>{v}</span>
          </div>
        ))}
      </div>

      {docCount > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>Attached documents</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(Object.keys(draft.documents) as DocumentSlot[]).map((slot) => (
              <li key={slot} style={{ fontFamily: 'var(--f-meta)', fontSize: 11, color: 'var(--navy)', letterSpacing: '0.06em' }}>
                <span style={{ color: '#4F8F4F', marginRight: 6 }}>✓</span>
                {DOCUMENT_LABELS[slot].label} — {draft.documents[slot]?.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <WizardFooter
        back={{ href: '/portfolio/add/tier', label: 'Back to tier' }}
        primary={{
          label: submitting ? 'Submitting…' : <>Submit for verification <span className="arrow">→</span></>,
          onClick: onSubmit,
          disabled: !hydrated || submitting,
          variant: 'gold',
        }}
      />
    </WizardCard>
  );
}
