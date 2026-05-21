import Link from 'next/link';
import { ConfirmedSummary } from './ConfirmedSummary';
import { Brand } from '@/components/brand/Brand';

type Search = { vpid?: string };

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { vpid } = await searchParams;
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 4px' }}>
      <div className="wizard-mobile-chrome" style={{ marginBottom: 8 }}>
        <Brand meta="VERITY · BUYER" />
      </div>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <div
          style={{
            width: 60, height: 60, borderRadius: 999, background: 'var(--gold)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
          }}
        >
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <path d="M2 10l8 8L22 2" stroke="#1E2260" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Request received</div>
        <h1 className="bf-h1" style={{ maxWidth: '20ch', margin: '0 auto' }}>
          The work has <em className="bf-italic">begun.</em>
        </h1>
      </div>

      <ConfirmedSummary vpid={vpid} />

      <p className="bf-small" style={{ marginTop: 20, lineHeight: 1.55 }}>
        A confirmation has been sent to your inbox. We&apos;ll WhatsApp you when each stage closes — quietly, no marketing.
      </p>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href={vpid ? `/requests/${vpid}` : '/dashboard'} className="bf-btn primary" style={{ textDecoration: 'none' }}>
          Track this request <span className="arrow">→</span>
        </Link>
        <Link href="/dashboard" className="bf-btn ghost" style={{ textDecoration: 'none' }}>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
