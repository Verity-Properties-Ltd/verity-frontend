'use client';

import Link from 'next/link';

export function WizardFooter({
  back,
  totalLabel,
  totalAmount,
  primary,
}: {
  back?: { href: string; label?: string };
  totalLabel?: string;
  totalAmount?: string;
  primary: {
    label: React.ReactNode;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    variant?: 'primary' | 'gold';
    type?: 'button' | 'submit';
  };
}) {
  const PrimaryEl = primary.href ? (
    <Link href={primary.href} className={`bf-btn ${primary.variant || 'primary'}`} style={{ textDecoration: 'none' }}>
      {primary.label}
    </Link>
  ) : (
    <button
      type={primary.type || 'button'}
      className={`bf-btn ${primary.variant || 'primary'}`}
      onClick={primary.onClick}
      disabled={primary.disabled}
    >
      {primary.label}
    </button>
  );

  return (
    <div className="bf-wizard-footer">
      <div className="bf-stickybar">
        {totalAmount ? (
          <div className="total">
            <span className="label">{totalLabel || 'Total'}</span>
            <span className="amount">{totalAmount}</span>
          </div>
        ) : back ? (
          <Link href={back.href} className="bf-btn outline" style={{ flex: 'none', width: 88, textDecoration: 'none' }}>
            {back.label || 'Back'}
          </Link>
        ) : null}
        {PrimaryEl}
      </div>
    </div>
  );
}
