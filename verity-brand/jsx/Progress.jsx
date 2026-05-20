// Verity — Progress + ProgressBar
function Progress({ value = 0, max = 100, gold = false }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="progress">
      <div className={`progress-bar ${gold ? 'gold' : ''}`} style={{ width: `${pct}%` }}></div>
    </div>
  );
}
