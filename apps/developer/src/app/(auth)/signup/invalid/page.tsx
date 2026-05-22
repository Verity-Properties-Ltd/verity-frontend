import Link from 'next/link';

type Search = { invite?: string };

export default async function InvalidInvitePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { invite } = await searchParams;
  const ref = invite || 'INV-LH-EXPIRED-0428';
  return (
    <div className="dv-invite-invalid">
      <div className="panel">
        <div className="seal">!</div>
        <div className="eyebrow">Invite link · cannot be opened</div>
        <h2>This invite link is invalid or has expired.</h2>
        <p className="body">
          For security, Founding 50 invite links expire 14 days after they&rsquo;re issued and become unusable once accepted. Contact your Verity advisor for a new one.
        </p>

        <div className="ref">
          verity.properties/signup?invite=<s>{ref}</s>
        </div>

        <div className="actions">
          <a href="mailto:founders@verity.properties" className="dv-btn primary">Contact my advisor</a>
          <a href="https://verity.properties" className="dv-btn outline">Back to verity.properties</a>
        </div>

        <div style={{
          marginTop: 28, paddingTop: 16,
          borderTop: '1px solid var(--line)',
          fontFamily: 'var(--f-meta)', fontSize: 9,
          color: 'var(--slate-soft)', letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}>
          Already have an account?{' '}
          <Link href="/signin" style={{ color: 'var(--navy)', borderBottom: '1px solid var(--gold)', paddingBottom: 1, textDecoration: 'none', letterSpacing: '0.18em' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
