// Verity — Confidence Band pill
// band: platinum | gold | silver | bronze | provisional | unconfirmed | revoked | expired
const BAND_LABEL = {
  platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze',
  provisional: 'Provisional', unconfirmed: 'Unconfirmed', revoked: 'Revoked', expired: 'Expired',
};

function ConfidenceBand({ band = 'unconfirmed', score, children }) {
  return (
    <span className={`band band-${band}`}>
      {children || BAND_LABEL[band] || band}
      {score != null && <span className="band-score"> · {score}</span>}
    </span>
  );
}

// Large certificate declaration: <BandDisplay band score statement={<>Verified to <em>Gold</em>.</>} />
function BandDisplay({ band = 'gold', score, statement, caption }) {
  return (
    <div className="band-display">
      <ConfidenceBand band={band} score={score} />
      {statement && <div className="band-statement">{statement}</div>}
      {caption && <div className="band-caption">{caption}</div>}
    </div>
  );
}
