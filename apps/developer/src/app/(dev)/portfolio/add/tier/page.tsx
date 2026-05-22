'use client';

import { useRouter } from 'next/navigation';
import { WizardCard } from '@/components/wizard/WizardCard';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { useAddPropertyDraft } from '@/lib/hooks/useAddPropertyDraft';
import type { VerificationTier } from '@/lib/types/add';

const TIERS: { id: VerificationTier; label: string; price: string; sla: string; features: string[]; maxBand: string }[] = [
  {
    id: 'standard',
    label: 'Standard',
    price: '₦50,000',
    sla: '5–7 business days',
    features: ['Document authenticity', 'Lagos State Land Registry crosscheck', 'VPID graph — competing-claims search'],
    maxBand: 'Silver',
  },
  {
    id: 'premium',
    label: 'Premium',
    price: '₦150,000',
    sla: '3–5 business days',
    features: ['Everything in Standard', 'Physical site visit', 'Survey plan accuracy crosscheck', 'Sworn specialist sign-off'],
    maxBand: 'Platinum',
  },
];

export default function TierStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useAddPropertyDraft();

  return (
    <WizardCard
      slug="tier"
      title={<>How <em>deep</em> should we verify?</>}
      lede="Founding 50 cohort members have free verification through Q3 2027 — we'll show the list price for context, but you won't be charged."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginTop: 24 }} className="dv-add-tiers">
        {TIERS.map((t) => {
          const selected = draft.tier === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => update({ tier: t.id })}
              style={{
                background: '#fff',
                border: selected ? '1px solid var(--gold)' : '1px solid var(--line)',
                boxShadow: selected ? '0 0 0 1px var(--gold) inset' : undefined,
                padding: 18,
                borderRadius: 6,
                textAlign: 'left',
                cursor: 'pointer',
                position: 'relative',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, letterSpacing: '0.22em', color: selected ? 'var(--gold-deep)' : 'var(--slate)', textTransform: 'uppercase' }}>
                  — {t.label}
                </span>
                <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  {t.sla}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 500, color: 'var(--navy)', marginTop: 6 }}>
                {t.price} <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em', marginLeft: 8 }}>· COHORT CREDIT</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
                {t.features.map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: 13, color: 'var(--navy)' }}>
                    <span style={{ color: 'var(--gold-deep)', fontFamily: 'var(--f-meta)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 10, fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                MAX BAND · {t.maxBand}
              </div>
            </button>
          );
        })}
      </div>

      <WizardFooter
        back={{ href: '/portfolio/add/reference', label: 'Back to reference' }}
        primary={{
          label: <>Continue · review <span className="arrow">→</span></>,
          onClick: () => router.push('/portfolio/add/review'),
          disabled: !hydrated,
        }}
      />
    </WizardCard>
  );
}
