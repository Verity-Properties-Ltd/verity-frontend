'use client';

import Link from 'next/link';
import { ADD_STEPS, type StepSlug } from '@dev/lib/types/add';

export function WizardSide({ currentSlug }: { currentSlug: StepSlug }) {
  const currentIdx = ADD_STEPS.findIndex((s) => s.slug === currentSlug);
  return (
    <aside className="dv-wiz-side">
      <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
        Submission · {ADD_STEPS.length} steps
      </div>
      {ADD_STEPS.map((s, i) => {
        const state = i < currentIdx ? 'done' : i === currentIdx ? 'current' : '';
        const canJump = i <= currentIdx;
        const content = (
          <>
            <span className="num">{s.num}</span>
            <span className="h">{s.label}</span>
          </>
        );
        return canJump ? (
          <Link key={s.slug} href={`/developer/portfolio/add/${s.slug}`} className={`step ${state}`} style={{ textDecoration: 'none' }}>
            {content}
          </Link>
        ) : (
          <div key={s.slug} className={`step ${state}`}>{content}</div>
        );
      })}

      <div style={{ marginTop: 24, padding: '14px 16px', background: 'var(--cream)', border: '1px solid var(--line)', borderRadius: 4 }}>
        <div style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 6 }}>
          Cohort pricing
        </div>
        <div style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 18, color: 'var(--navy)', lineHeight: 1.3 }}>
          Free verification through Q3 2027.
        </div>
        <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>Founding 50 · cohort 014</div>
      </div>
    </aside>
  );
}
