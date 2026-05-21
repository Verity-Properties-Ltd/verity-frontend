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
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: 64, height: 64, borderRadius: 999, background: 'var(--cream-shade)',
          border: '1px solid var(--gold)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}
      >
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
          <rect x="1" y="1" width="20" height="16" rx="2" stroke="#A88A45" strokeWidth="1.5" />
          <path d="M2 3l9 7 9-7" stroke="#A88A45" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Check your inbox</div>
      <h1 className="bf-h1" style={{ maxWidth: '15ch' }}>
        We&apos;ve sent a <em className="bf-italic">verification link.</em>
      </h1>
      <p className="bf-small" style={{ marginTop: 16, maxWidth: '32ch' }}>
        {email ? <>Open the email at <span className="bf-mono" style={{ fontSize: 12 }}>{display}</span> and click the link to continue.</> : <>Open your inbox and click the verification link to continue.</>}
      </p>

      <hr className="bf-divider gold" style={{ margin: '24px auto' }} />

      <ResendLink email={email} />

      <a
        href="/dashboard"
        className="bf-btn primary"
        style={{ marginTop: 28, maxWidth: 280, textDecoration: 'none' }}
      >
        Continue to dashboard <span className="arrow">→</span>
      </a>
    </div>
  );
}
