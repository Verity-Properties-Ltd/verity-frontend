export function AvmCard({ value, confidence }: { value: string; confidence: number }) {
  const tone =
    confidence >= 85 ? 'high' :
    confidence >= 65 ? 'medium' :
    'low';

  return (
    <div className={`dv-avm tone-${tone}`}>
      <div className="dv-avm-head">
        <span className="lbl">Automated Valuation</span>
        <span className="aux">AVM · model v3.2</span>
      </div>
      <div className="dv-avm-value">{value}</div>
      <div className="dv-avm-confidence">
        <span className="dot" />
        <span className="pct">{confidence}%</span>
        <span className="cap">confidence</span>
      </div>
      <div className="dv-avm-meter">
        <div className="bar" style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }} />
      </div>
    </div>
  );
}
