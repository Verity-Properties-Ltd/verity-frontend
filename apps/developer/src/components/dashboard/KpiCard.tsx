export function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaKind,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaKind?: 'up' | 'warn';
}) {
  return (
    <div className="dv-kpi">
      <div className="label">{label}</div>
      <div className="value">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {delta && <div className={`delta${deltaKind ? ` ${deltaKind}` : ''}`}>{delta}</div>}
    </div>
  );
}
