'use client';

import { useState } from 'react';

export function PublicUrlCard({ vpid }: { vpid: string }) {
  const url = `verity.properties/v/${vpid.toUpperCase()}`;
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try { await navigator.clipboard.writeText(`https://${url}`); } catch { /* ignore */ }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ marginTop: 16, background: 'var(--cream-shade)', border: '1px solid var(--line)', padding: 22 }}>
      <div style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
        Public verification URL
      </div>
      <div style={{ fontFamily: 'var(--f-meta)', fontSize: 12, color: 'var(--navy)', wordBreak: 'break-all', lineHeight: 1.5 }}>
        {url}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button type="button" onClick={onCopy} className="dv-btn outline sm" style={{ flex: 1, justifyContent: 'center' }}>
          {copied ? 'Copied' : 'Copy URL'}
        </button>
        <button type="button" className="dv-btn outline sm" style={{ flex: 1, justifyContent: 'center' }}>
          QR code
        </button>
      </div>
    </div>
  );
}
