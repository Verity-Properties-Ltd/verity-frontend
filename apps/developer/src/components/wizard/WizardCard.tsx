import type { StepSlug } from '@/lib/types/add';
import { ADD_STEPS } from '@/lib/types/add';

export function WizardCard({
  slug,
  title,
  lede,
  children,
}: {
  slug: StepSlug;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
}) {
  const step = ADD_STEPS.find((s) => s.slug === slug)!;
  return (
    <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: 24 }}>
      <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
        Step {step.num} · {step.label}
      </div>
      <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 500, color: 'var(--navy)', margin: 0, letterSpacing: '-0.005em' }}>
        {title}
      </h2>
      {lede && (
        <p style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 16, color: 'var(--slate)', marginTop: 8, maxWidth: '56ch' }}>
          {lede}
        </p>
      )}
      {children}
    </div>
  );
}
