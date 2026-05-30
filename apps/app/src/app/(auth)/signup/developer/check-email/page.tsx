import Link from 'next/link';
import { ResendLink } from './ResendLink';

type Search = { email?: string };

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { email } = await searchParams;
  const display = email || 'your inbox';

  return (
    <div className="dv-verify-sent">
      <div className="panel">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />

        <div className="seal">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="6" y="9" width="24" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="#fff" />
            <path d="M6.5 10.5 L18 19 L29.5 10.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="29" cy="9" r="4.5" fill="var(--gold)" />
            <path d="M27 9 L28.5 10.5 L31 8" stroke="var(--navy)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="eyebrow">Step 02 of 02 · Verify your email</div>
        <h2>Check your inbox — we&rsquo;ve sent a <em>verification link</em>.</h2>
        <p className="body">
          Open the email from Verity and click the link to finish creating your account. Your workspace and onboarding checklist are waiting on the other side.
        </p>

        <div className="email-pill">
          <span className="dot" />
          {display}
        </div>

        <div className="helper">
          <div className="it">
            <span className="n">01</span>
            <div className="body-t">Open the email from Verity<span className="sub">Sender: verify@verity.properties</span></div>
          </div>
          <div className="it">
            <span className="n">02</span>
            <div className="body-t">Click the verification link<span className="sub">Expires in 30 minutes for security</span></div>
          </div>
          <div className="it">
            <span className="n">03</span>
            <div className="body-t">Land on the dashboard<span className="sub">Where you&rsquo;ll complete company verification</span></div>
          </div>
          <div className="it">
            <span className="n">04</span>
            <div className="body-t">Add your first property<span className="sub">Unlocked once KYC clears — usually same day</span></div>
          </div>
        </div>

        <div className="actions-row">
          <Link href="/signup/developer" className="dv-btn outline">Change email address</Link>
          <ResendLink email={email} />
        </div>

        <div style={{ marginTop: 24, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
          <Link href="/developer" className="dv-btn primary">
            Continue to dashboard <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
