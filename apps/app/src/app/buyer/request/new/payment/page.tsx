'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequestDraft } from '@/lib/hooks/useRequestDraft';
import { requestService } from '@/lib/services';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { TIER_LABEL, TIER_PRICE, type PaymentMethod } from '@/lib/types/request';

const METHODS: { id: PaymentMethod; label: string; sub: string; mark: string; bg: string; fg: string }[] = [
  { id: 'card', label: 'Card · International accepted', sub: 'Paystack · processed in £ for diaspora cards', mark: 'VISA', bg: 'var(--navy)', fg: 'var(--gold)' },
  { id: 'bank', label: 'Bank transfer · Nigerian account', sub: 'Instant verification via Paystack', mark: 'NGN', bg: 'var(--cream-shade)', fg: 'var(--navy)' },
];

export default function PaymentStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useRequestDraft();
  const [submitting, setSubmitting] = useState(false);
  const tier = draft.tier;
  const total = tier ? TIER_PRICE[tier] : 0;
  const totalLabel = tier ? `₦${total.toLocaleString()}` : '—';

  function selectMethod(id: PaymentMethod) {
    update((d) => ({ ...d, payment: { ...d.payment, method: id } }));
  }

  async function onSubmit() {
    if (!tier || submitting) return;
    setSubmitting(true);
    try {
      const { vpid } = await requestService.submit(draft);
      router.push(`/request/new/confirmed?vpid=${vpid}`);
    } catch {
      setSubmitting(false);
    }
  }

  if (hydrated && !tier) {
    return (
      <>
        <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Payment</div>
        <h2 className="bf-h2">Pick a tier first.</h2>
        <p className="bf-small" style={{ marginTop: 12 }}>You need to choose a verification tier before paying.</p>
        <WizardFooter
          back={{ href: '/buyer/request/new/tier', label: 'Back to tier' }}
          primary={{ label: 'Choose tier', href: '/buyer/request/new/tier' }}
        />
      </>
    );
  }

  return (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Payment</div>
      <h2 className="bf-h2">
        Settle in <em className="bf-italic">naira or sterling.</em>
      </h2>

      <div className="bf-card cream" style={{ marginTop: 18, padding: 16, maxWidth: 720 }}>
        <div className="bf-row" style={{ justifyContent: 'space-between' }}>
          <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em' }}>ORDER SUMMARY</span>
          <span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>VPR-PENDING</span>
        </div>
        <hr className="bf-divider" style={{ margin: '12px 0' }} />
        <div className="bf-stack" style={{ gap: 6 }}>
          <div className="bf-row" style={{ justifyContent: 'space-between' }}>
            <span className="bf-small" style={{ color: 'var(--navy)' }}>{tier && TIER_LABEL[tier]} verification</span>
            <span className="bf-mono" style={{ fontSize: 13, color: 'var(--navy)' }}>{totalLabel}</span>
          </div>
          {draft.property.streetAddressInput && (
            <div className="bf-row" style={{ justifyContent: 'space-between' }}>
              <span className="bf-small">{draft.property.streetAddressInput}</span>
              <span className="bf-small" style={{ fontStyle: 'italic' }}>{draft.property.City || draft.property.CountyOrParish || ''}</span>
            </div>
          )}
        </div>
        <hr className="bf-divider" style={{ margin: '12px 0' }} />
        <div className="bf-row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em' }}>TOTAL</span>
          <span className="bf-h2" style={{ fontWeight: 500 }}>
            {totalLabel} <span className="bf-small" style={{ color: 'var(--slate)', fontSize: 12 }}>· £{Math.round(total / 2000)} approx</span>
          </span>
        </div>
      </div>

      <div className="bf-eyebrow slate" style={{ marginTop: 22, marginBottom: 8 }}>— Method</div>
      <div className="bf-stack" style={{ gap: 8, maxWidth: 720 }}>
        {METHODS.map((m) => {
          const selected = draft.payment.method === m.id;
          return (
            <div
              key={m.id}
              className={`bf-card tier${selected ? ' selected' : ''}`}
              style={{ padding: 14 }}
              onClick={() => selectMethod(m.id)}
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
              <div className="bf-row" style={{ gap: 12, alignItems: 'center' }}>
                <div style={{ width: 36, height: 24, borderRadius: 3, background: m.bg, border: m.id === 'bank' ? '1px solid var(--line)' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="bf-mono" style={{ color: m.fg, fontSize: 9, letterSpacing: '0.1em' }}>{m.mark}</span>
                </div>
                <div>
                  <div className="bf-body" style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</div>
                  <div className="bf-small" style={{ fontSize: 11, marginTop: 2 }}>{m.sub}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {draft.payment.method === 'card' && (
        <div className="bf-stack" style={{ gap: 14, marginTop: 22, maxWidth: 720 }}>
          <div className="bf-field">
            <label className="bf-label" htmlFor="cardNumber">Card number</label>
            <input id="cardNumber" className="bf-input mono" placeholder="4485 •••• •••• 9021" />
          </div>
          <div className="bf-grid-2">
            <div className="bf-field">
              <label className="bf-label" htmlFor="cardExp">Expiry</label>
              <input id="cardExp" className="bf-input mono" placeholder="08 / 28" />
            </div>
            <div className="bf-field">
              <label className="bf-label" htmlFor="cardCvc">CVC</label>
              <input id="cardCvc" className="bf-input mono" placeholder="•••" />
            </div>
          </div>
        </div>
      )}

      <WizardFooter
        back={{ href: '/buyer/request/new/tier' }}
        totalLabel="Total"
        totalAmount={totalLabel}
        primary={{
          label: submitting ? 'Submitting…' : <>Pay &amp; submit <span className="arrow">→</span></>,
          onClick: onSubmit,
          disabled: !hydrated || !tier || submitting,
          variant: 'gold',
        }}
      />
    </>
  );
}
