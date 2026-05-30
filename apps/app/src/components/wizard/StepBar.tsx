export function StepBar({ steps, current }: { steps: readonly string[]; current: number }) {
  return (
    <div className="bf-steps">
      {steps.map((s, i) => {
        const cls = i < current ? 'done' : i === current ? 'current' : '';
        return <div key={s} className={`seg ${cls}`} />;
      })}
    </div>
  );
}

export const REQUEST_STEPS = ['Property', 'Documents', 'Tier', 'Payment', 'Confirm'] as const;
