import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Verity',
  description: 'How Verity collects, uses, and protects personal data on the pre-launch landing.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-[760px] mx-auto px-6 sm:px-10 py-16 sm:py-24 font-sans">
      <Link
        href="/"
        className="text-[var(--slate)] hover:text-[var(--navy)] text-[11px] tracking-[0.22em] uppercase transition-colors"
        style={{ fontFamily: 'var(--f-mono)' }}
      >
        ← Verity
      </Link>

      <h1
        className="mt-10 mb-4 text-[var(--navy)]"
        style={{ fontFamily: 'var(--f-serif)', fontSize: 42, lineHeight: 1.1, letterSpacing: '-0.02em' }}
      >
        Privacy Policy
      </h1>

      <p className="text-[var(--slate)] text-[13px] tracking-[0.18em] uppercase mb-12" style={{ fontFamily: 'var(--f-mono)' }}>
        Effective May 2026 · NDPR Compliant · Pending external counsel review
      </p>

      <div className="prose-content text-[15.5px] leading-[1.8] text-[var(--navy)] space-y-6">
        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            What we collect at this stage
          </h2>
          <p>
            Verity (Verity Property Technologies Ltd.) collects two categories of personal information through the
            verity.properties landing site: <strong>buyer waitlist submissions</strong> (first name, last name, email,
            country of residence, buying-timing bucket) and <strong>Founding 50 applications</strong> (first name, last
            name, work email, company name, portfolio size, role, optional website and free-text description of what
            you&rsquo;re building).
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Why we collect it
          </h2>
          <p>
            Waitlist data is used to notify you at launch with priority access. Founding 50 applications are reviewed by
            the founding team for cohort admission. We do not sell, rent, or share this data with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Your rights under NDPR
          </h2>
          <p>
            You have the right to access, correct, or delete your personal data at any time by emailing{' '}
            <a href="mailto:privacy@verity.properties" className="text-[var(--navy)] border-b border-[var(--gold)]">
              privacy@verity.properties
            </a>
            . We respond within thirty days per the Nigeria Data Protection Regulation.
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Retention
          </h2>
          <p>
            Waitlist submissions are retained until launch + 90 days, then either converted to a verified buyer account
            (with your explicit consent) or deleted. Founding 50 applications are retained for the duration of the
            program and reviewed annually.
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Contact
          </h2>
          <p>
            Verity Property Technologies Ltd.<br />
            Lagos, Nigeria · Houston, Texas<br />
            <a href="mailto:hello@verity.properties" className="text-[var(--navy)] border-b border-[var(--gold)]">
              hello@verity.properties
            </a>
          </p>
        </section>

        <p className="mt-12 text-[12px] text-[var(--slate-soft)] italic">
          This policy is a draft authored in-house by the founding team. External counsel review is pending under
          backlog item OPR-07. The final ratified policy will replace this page before public verification orders open.
        </p>
      </div>
    </main>
  );
}
