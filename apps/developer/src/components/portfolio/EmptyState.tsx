import Link from 'next/link';

const STAGES = [
  { num: '01', title: 'Submit your portfolio',     sub: "Upload property details and supporting documents — survey plans, CofOs, deeds, governor's consents." },
  { num: '02', title: 'VERITY field verification', sub: "Our team verifies title, registry status, and on-site presence. We'll request anything missing." },
  { num: '03', title: 'Certificates issued',       sub: 'Each verified property receives a confidence band, a public URL, and a downloadable certificate.' },
  { num: '04', title: 'Distribute & close deals',  sub: 'Embed certificates on your listing pages, share URLs in sales conversations.' },
];

export function EmptyState({ cohort = '014', admittedAt = '02 May 2026' }: { cohort?: string; admittedAt?: string }) {
  return (
    <div className="dv-empty">
      <div>
        <div className="eyebrow">Founding 50 · Cohort {cohort} · Admitted {admittedAt}</div>
        <h2>Welcome to <em>Verity.</em> Let&rsquo;s get your portfolio verified.</h2>
        <p>
          You&rsquo;re admitted. The next step is to submit your existing inventory — one property at a time, or as a CSV
          batch if you have many. First certificates are typically issued within two to four weeks, depending on
          portfolio size and document availability.
        </p>
        <div className="actions">
          <Link href="/portfolio/add/type" className="dv-btn primary">
            Add your first property <span className="arrow">→</span>
          </Link>
          <Link href="/portfolio/add/csv" className="dv-btn outline">
            Bulk-import from spreadsheet
          </Link>
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: 'var(--f-meta)',
            fontSize: 10,
            color: 'var(--slate)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          What happens next
        </div>
        <div className="stages">
          {STAGES.map((s) => (
            <div key={s.num} className="stage">
              <span className="num">{s.num}</span>
              <div>
                <div className="h">{s.title}</div>
                <div className="sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
