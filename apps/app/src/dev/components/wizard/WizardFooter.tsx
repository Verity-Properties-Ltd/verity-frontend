'use client';

import Link from 'next/link';

export function WizardFooter({
  back,
  primary,
  saveDraft,
}: {
  back?: { href: string; label: string };
  primary: { label: React.ReactNode; onClick?: () => void; href?: string; disabled?: boolean; variant?: 'primary' | 'gold' };
  /** Wires the Save Draft button. Omit (or null) to hide it. */
  saveDraft?: { onClick: () => void; disabled?: boolean } | null;
}) {
  const PrimaryEl = primary.href ? (
    <Link href={primary.href} className={`dv-btn ${primary.variant || 'primary'}`} style={{ textDecoration: 'none' }}>
      {primary.label}
    </Link>
  ) : (
    <button type="button" className={`dv-btn ${primary.variant || 'primary'}${primary.disabled ? ' disabled' : ''}`} onClick={primary.onClick} disabled={primary.disabled}>
      {primary.label}
    </button>
  );
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--line)', gap: 12, flexWrap: 'wrap' }}>
      {back ? (
        <Link href={back.href} className="dv-btn ghost" style={{ textDecoration: 'none' }}>
          ← {back.label}
        </Link>
      ) : <span />}
      <div style={{ display: 'flex', gap: 8 }}>
        {saveDraft && (
          <button
            type="button"
            className={`dv-btn outline${saveDraft.disabled ? ' disabled' : ''}`}
            onClick={saveDraft.onClick}
            disabled={saveDraft.disabled}
          >
            Save draft
          </button>
        )}
        {PrimaryEl}
      </div>
    </div>
  );
}
