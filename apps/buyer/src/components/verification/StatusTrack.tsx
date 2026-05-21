import { VERIFICATION_STAGES } from '@/lib/types/verification';

export function StatusTrack({
  currentStage,
  completedDates = {},
  skipped = [],
}: {
  currentStage: number;
  completedDates?: Record<number, string>;
  skipped?: number[];
}) {
  return (
    <div className="bf-track">
      {VERIFICATION_STAGES.map((s, i) => {
        const isSkipped = skipped.includes(i);
        const isDone = !isSkipped && i < currentStage;
        const isCurrent = !isSkipped && i === currentStage;
        const cls = isSkipped ? 'skipped' : isDone ? 'done' : isCurrent ? 'current' : 'pending';
        const pip = isSkipped ? '–' : isDone ? '✓' : (i + 1).toString().padStart(2, '0');
        const when = isSkipped
          ? 'Not included in Standard'
          : isDone
            ? completedDates[i] || 'Completed'
            : isCurrent
              ? 'In progress'
              : '—';
        return (
          <div key={s.name} className={`stage ${cls}`}>
            <div className="rail" />
            <div className="pip">{pip}</div>
            <div className="info">
              <div className="name">{s.name}</div>
              <div className="when">{when}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
