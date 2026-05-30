import type { VerificationCheck } from '@dev/lib/types/property';

function symbolFor(result: VerificationCheck['result']): string {
  if (result === 'pass') return '✓';
  if (result === 'fail') return '✗';
  return '·';
}

export function ChecksList({ checks }: { checks: VerificationCheck[] }) {
  return (
    <ul className="dv-checks">
      {checks.map((c) => (
        <li key={c.id} className={`dv-check tone-${c.result}`}>
          <span className="dv-check-icon" aria-hidden="true">{symbolFor(c.result)}</span>
          <div className="dv-check-body">
            <div className="name">{c.name}</div>
            <div className="desc">{c.description}</div>
          </div>
          <span className="dv-check-tag">{c.result.toUpperCase()}</span>
        </li>
      ))}
    </ul>
  );
}
