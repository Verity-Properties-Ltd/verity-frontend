import type { VerificationStep } from '@dev/lib/types/property';

type Step = { id: VerificationStep; label: string; description: string };

const STEPS: Step[] = [
  { id: 'uploaded',       label: 'Uploaded',       description: 'Submission received' },
  { id: 'under-review',   label: 'Under Review',   description: 'Triage queue' },
  { id: 'ai-processing',  label: 'AI Processing',  description: 'OCR · extraction · checks' },
  { id: 'analyst-review', label: 'Analyst Review', description: 'Specialist sign-off' },
  { id: 'complete',       label: 'Complete',       description: 'Certificate issued' },
];

function stepPosition(step: VerificationStep): number {
  return STEPS.findIndex((s) => s.id === step);
}

export function VerificationStepTracker({
  current,
  estimatedCompletion,
}: {
  current: VerificationStep;
  estimatedCompletion?: string;
}) {
  const idx = stepPosition(current);
  return (
    <div className="dv-step-tracker">
      <div className="dv-step-tracker-rail">
        {STEPS.map((step, i) => {
          const isPast = i < idx;
          const isCurrent = i === idx;
          const stateClass = isCurrent ? 'current' : isPast ? 'past' : 'future';
          return (
            <div key={step.id} className={`dv-step ${stateClass}`}>
              <div className="marker">
                <span className="dot" />
              </div>
              <div className="meta">
                <div className="label">{step.label}</div>
                <div className="desc">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      {estimatedCompletion && current !== 'complete' && (
        <div className="dv-step-eta">
          Estimated completion · <span className="v">{estimatedCompletion}</span>
        </div>
      )}
    </div>
  );
}
