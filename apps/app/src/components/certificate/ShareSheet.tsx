'use client';

import { useState } from 'react';
import { shareService } from '@/lib/services';

type Action = { id: 'whatsapp' | 'email' | 'pdf' | 'qr'; label: string; sub: string; mark: string };

const ACTIONS: Action[] = [
  { id: 'whatsapp', label: 'WhatsApp', sub: 'Quick share', mark: 'WA' },
  { id: 'email',    label: 'Email',    sub: 'Lawyer / bank', mark: 'EM' },
  { id: 'pdf',      label: 'PDF',      sub: 'Download', mark: 'PD' },
  { id: 'qr',       label: 'QR',       sub: 'Print / scan', mark: 'QR' },
];

export function ShareSheet({ vpid, onClose }: { vpid: string; onClose: () => void }) {
  const publicUrl = `verity.properties/v/${vpid.toUpperCase()}`;
  const [copied, setCopied] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onCopy() {
    await shareService.copyLink(vpid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function onSendEmail() {
    if (!recipient.includes('@') || sending) return;
    setSending(true);
    await shareService.email(vpid, recipient);
    setSending(false);
    setSent(true);
    setTimeout(() => onClose(), 1200);
  }

  function onActionClick(a: Action) {
    if (a.id === 'whatsapp') {
      window.open(shareService.whatsappUrl(vpid), '_blank', 'noopener');
    } else if (a.id === 'email') {
      const input = document.getElementById('share-recipient');
      input?.focus();
    } else if (a.id === 'pdf') {
      window.print();
    }
    /* qr: no-op for Phase 4 */
  }

  return (
    <>
      <div className="bf-pad" style={{ paddingTop: 4, paddingBottom: 8 }}>
        <div className="bf-eyebrow" style={{ marginBottom: 8 }}>— Share verification</div>
        <h3 className="bf-h2" style={{ fontSize: 22 }}>
          Send to your <em className="bf-italic">lawyer</em>, your bank, or your family.
        </h3>
        <p className="bf-small" style={{ marginTop: 8 }}>The link is share-safe and works without an account.</p>
      </div>

      <div className="bf-pad" style={{ paddingTop: 8, paddingBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--line-strong)', borderRadius: 6, background: '#fff', padding: '12px 14px' }}>
          <span className="bf-mono" style={{ fontSize: 11, color: 'var(--navy)', letterSpacing: '0.06em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {publicUrl}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="bf-mono"
            style={{ border: '1px solid var(--gold)', background: 'var(--gold)', color: 'var(--navy)', padding: '6px 10px', borderRadius: 4, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="bf-pad" style={{ paddingTop: 4, paddingBottom: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {ACTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onActionClick(a)}
              style={{ textAlign: 'center', background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--cream-shade)', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <span className="bf-mono" style={{ fontSize: 9, color: 'var(--navy)', letterSpacing: '0.1em' }}>{a.mark}</span>
              </div>
              <div className="bf-small" style={{ fontSize: 12, color: 'var(--navy)' }}>{a.label}</div>
              <div className="bf-mono" style={{ fontSize: 8, color: 'var(--slate)', letterSpacing: '0.14em', marginTop: 2 }}>{a.sub.toUpperCase()}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bf-pad" style={{ paddingTop: 18, paddingBottom: 8 }}>
        <div className="bf-eyebrow slate" style={{ marginBottom: 8, fontSize: 9 }}>— Or send directly</div>
        <div className="bf-field">
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="share-recipient"
              className="bf-input"
              placeholder="lawyer@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ flex: 1 }}
              type="email"
            />
            <button
              type="button"
              className="bf-btn primary"
              style={{ width: 84, height: 48 }}
              onClick={onSendEmail}
              disabled={!recipient.includes('@') || sending || sent}
            >
              {sent ? 'Sent' : sending ? '…' : 'Send'}
            </button>
          </div>
          <div className="bf-help">We&apos;ll attach the PDF and a one-line note in Verity&apos;s signature.</div>
        </div>
      </div>

      <div className="bf-pad" style={{ paddingTop: 6, paddingBottom: 0 }}>
        <button type="button" className="bf-btn ghost" onClick={onClose}>Close</button>
      </div>
    </>
  );
}
