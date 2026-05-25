'use client';

import { useEffect } from 'react';
import { useRequestDraft } from '@/lib/hooks/useRequestDraft';
import { TIER_LABEL } from '@/lib/types/request';

function expectedDate(tier: 'standard' | 'premium' | null) {
  const days = tier === 'standard' ? 7 : 5;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function ConfirmedSummary({ vpid }: { vpid?: string }) {
  const { draft, hydrated } = useRequestDraft();

  useEffect(() => {
    if (hydrated && vpid && typeof window !== 'undefined') {
      window.sessionStorage.removeItem('verity:draft');
    }
  }, [hydrated, vpid]);

  return (
    <div className="bf-card cream" style={{ marginTop: 24, padding: 18 }}>
      <div className="bf-stack" style={{ gap: 12 }}>
        <div>
          <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>YOUR REPORT REFERENCE</div>
          <div className="bf-mono" style={{ fontSize: 16, color: 'var(--navy)', letterSpacing: '0.16em', marginTop: 4 }}>
            {vpid || 'VPR-PENDING'}
          </div>
        </div>
        <hr className="bf-divider" />
        <div>
          <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>EXPECTED DELIVERY</div>
          <div className="bf-body" style={{ fontSize: 16, marginTop: 4, color: 'var(--navy)' }}>
            By <em className="bf-italic">{expectedDate(draft.tier)}</em> · {draft.tier === 'standard' ? '5–7 business days' : '3–5 business days'}
          </div>
        </div>
        <hr className="bf-divider" />
        <div>
          <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>PROPERTY</div>
          <div className="bf-body" style={{ fontSize: 14, marginTop: 4, color: 'var(--navy)' }}>
            {draft.property.streetAddressInput || '—'}
          </div>
        </div>
        {draft.tier && (
          <>
            <hr className="bf-divider" />
            <div>
              <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>TIER · DOCUMENTS</div>
              <div className="bf-body" style={{ fontSize: 14, marginTop: 4, color: 'var(--navy)' }}>
                {TIER_LABEL[draft.tier]} · {draft.documents.length} file{draft.documents.length === 1 ? '' : 's'}{draft.noDocuments ? ' (none attached)' : ''}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
