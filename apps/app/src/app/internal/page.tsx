import Link from 'next/link';

export default function InternalLanding() {
  return (
    <div className="int-page">
      <div className="int-eyebrow">Internal admin shell · Phase 1 scaffold</div>
      <h1 className="int-h1">Welcome.</h1>
      <p className="int-lede">
        These surfaces are navigable shells. The concrete workflow logic ships per the ANL-*, OPS-* and
        SUP-* stories in the Build Backlog. Pick a destination from the sidebar, or jump in below.
      </p>

      <div className="int-shortcuts">
        <ShortcutCard
          eyebrow="ANL-01 / ANL-02"
          title="Specialist · My Queue"
          body="Prioritised list of assigned verifications + the verification workspace where the five evidence workstreams are completed."
          href="/internal/specialist"
        />
        <ShortcutCard
          eyebrow="OPS-01 / OPS-02 / OPS-03"
          title="Operations · Production Board"
          body="Pipeline view grouped by status, plus assignment and review queues for analyst sign-offs."
          href="/internal/ops"
        />
        <ShortcutCard
          eyebrow="SUP-01 / SUP-02 / SUP-04 / SUP-06"
          title="Super Admin · Accounts, Pricing, Analytics"
          body="Account directory, developer KYC fallback queue, pricing & plans, platform analytics."
          href="/internal/admin"
        />
        <ShortcutCard
          eyebrow="ANL-09 · PRD §14.6"
          title="Registry Liaison · Premium tier"
          body="Lagos State Land Registry workspace for Premium-tier verifications requiring in-person registry visits."
          href="/internal/registry"
        />
      </div>
    </div>
  );
}

function ShortcutCard({
  eyebrow,
  title,
  body,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="int-shortcut" style={{ textDecoration: 'none' }}>
      <div className="int-shortcut-eyebrow">{eyebrow}</div>
      <div className="int-shortcut-title">{title}</div>
      <div className="int-shortcut-body">{body}</div>
      <span className="int-shortcut-arrow">→</span>
    </Link>
  );
}
