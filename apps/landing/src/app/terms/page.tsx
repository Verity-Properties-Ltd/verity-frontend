import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — Verity',
  description: 'Terms governing the use of the verity.properties pre-launch site and the Founding 50 cohort.',
};

export default function TermsPage() {
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
        Terms of Service
      </h1>

      <p className="text-[var(--slate)] text-[13px] tracking-[0.18em] uppercase mb-12" style={{ fontFamily: 'var(--f-mono)' }}>
        Effective May 2026 · Governed by Nigerian law, Lagos State jurisdiction · Pending external counsel review
      </p>

      <div className="prose-content text-[15.5px] leading-[1.8] text-[var(--navy)] space-y-6">
        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Scope of these terms
          </h2>
          <p>
            These terms govern your use of the verity.properties landing site during the pre-launch period. The
            verification platform itself, once live, will be governed by a separate Master Services Agreement and
            tier-specific terms. Nothing on this site constitutes a binding offer to provide verification services until
            the platform opens.
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Permitted use
          </h2>
          <p>
            You may use the site to learn about Verity, submit a buyer waitlist entry, or apply to the Founding 50
            program. You may not scrape, reverse-engineer, attempt to access non-public endpoints, impersonate another
            person, or submit fraudulent information.
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Intellectual property
          </h2>
          <p>
            The Verity wordmark, the gold T, the design system, and all content on this site are the property of Verity
            Property Technologies Ltd. and may not be reproduced without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Disclaimers
          </h2>
          <p>
            The site is provided &ldquo;as is.&rdquo; Verity makes no warranty as to launch date, final pricing, or
            program admission. Statements on this site about future products are forward-looking and may change. To the
            fullest extent permitted by Nigerian law, Verity disclaims all warranties not expressly granted.
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Limitation of liability
          </h2>
          <p>
            Verity&rsquo;s liability arising from use of this pre-launch site is limited to a refund of any sums paid
            (currently zero — no payments are processed on this site).
          </p>
        </section>

        <section>
          <h2 className="text-[var(--navy)] mt-10 mb-3" style={{ fontFamily: 'var(--f-serif)', fontSize: 24, fontWeight: 500 }}>
            Governing law
          </h2>
          <p>
            These terms are governed by the laws of the Federal Republic of Nigeria. Disputes are subject to the
            exclusive jurisdiction of the courts of Lagos State.
          </p>
        </section>

        <p className="mt-12 text-[12px] text-[var(--slate-soft)] italic">
          These terms are a draft authored in-house by the founding team. External counsel review is pending under
          backlog item OPR-07. The final ratified terms will replace this page before public verification orders open.
        </p>
      </div>
    </main>
  );
}
