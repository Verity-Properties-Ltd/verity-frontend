'use client';

import { useRouter } from 'next/navigation';
import { useRequestDraft } from '@/lib/hooks/useRequestDraft';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { TIER_PRICE, type Tier } from '@/lib/types/request';

type TierSpec = {
  id: Tier;
  label: string;
  sla: string;
  price: number;
  features: { label: string; included: boolean }[];
  maxBand: 'silver' | 'platinum';
};

const TIERS: TierSpec[] = [
  {
    id: 'standard',
    label: 'Standard',
    sla: '5–7 BUSINESS DAYS',
    price: TIER_PRICE.standard,
    features: [
      { label: 'Document authenticity check', included: true },
      { label: 'Lagos State Land Registry crosscheck', included: true },
      { label: 'VPID graph — competing-claims search', included: true },
      { label: 'Physical site visit', included: false },
    ],
    maxBand: 'silver',
  },
  {
    id: 'premium',
    label: 'Premium',
    sla: '3–5 BUSINESS DAYS',
    price: TIER_PRICE.premium,
    features: [
      { label: 'Everything in Standard', included: true },
      { label: 'Physical site visit by licensed surveyor', included: true },
      { label: 'Survey plan accuracy crosscheck', included: true },
      { label: 'Sworn specialist sign-off', included: true },
    ],
    maxBand: 'platinum',
  },
];

export default function TierStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useRequestDraft();

  function select(id: Tier) {
    update({ tier: id });
  }

  function onContinue() {
    if (!draft.tier) return;
    router.push('/buyer/request/new/payment');
  }

  return (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Choose your tier</div>
      <h2 className="bf-h2">
        How <em className="bf-italic">deep</em> should we go?
      </h2>

      <div className="bf-tier-grid">
        {TIERS.map((t) => {
          const selected = draft.tier === t.id;
          return (
            <div
              key={t.id}
              className={`bf-card tier${selected ? ' selected' : ''}`}
              onClick={() => select(t.id)}
              role="radio"
              aria-checked={selected}
              tabIndex={0}
            >
              <span className="check">
                {selected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#1E2260" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <div className="bf-row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="bf-mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: selected ? 'var(--gold-deep)' : 'var(--slate)', textTransform: 'uppercase' }}>
                  — {t.label}
                </span>
                <span className="bf-mono" style={{ fontSize: 11, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>{t.sla}</span>
              </div>
              <div className="bf-h2" style={{ marginTop: 6, fontWeight: 500 }}>₦{t.price.toLocaleString()}</div>
              <hr className="bf-divider" style={{ margin: '12px 0' }} />
              <ul className="bf-evi">
                {t.features.map((f) => (
                  <li key={f.label} className={f.included ? '' : 'miss'}>
                    <span className="mark">{f.included ? '✓' : '—'}</span>
                    <div className="body">
                      <div className="h" style={!f.included ? { color: 'var(--slate)' } : undefined}>{f.label}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bf-row" style={{ marginTop: 12, gap: 8 }}>
                <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.2em' }}>MAX BAND</span>
                <span className={`bf-band ${t.maxBand}`}>
                  <span className="dot" />
                  <span>{t.maxBand === 'platinum' ? 'Platinum' : 'Silver'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="bf-small" style={{ marginTop: 18, fontStyle: 'italic', textAlign: 'center', color: 'var(--slate)' }}>
        Most diaspora buyers choose Premium when wiring more than ₦40m.
      </p>

      <WizardFooter
        back={{ href: '/buyer/request/new/documents' }}
        totalLabel="Subtotal"
        totalAmount={draft.tier ? `₦${TIER_PRICE[draft.tier].toLocaleString()}` : '—'}
        primary={{
          label: <>Continue <span className="arrow">→</span></>,
          onClick: onContinue,
          disabled: !hydrated || !draft.tier,
        }}
      />
    </>
  );
}
