/**
 * Verity — Confidence Band pill + display block.
 *
 * The six-band ladder per PRD §4.4 plus the two state overlays (revoked,
 * expired). Per PRD §11.2 this is a trust-critical domain primitive —
 * any change to band naming, colour, or layout requires founder review.
 *
 * Canonical CSS classes live in @verity/brand/tokens/components.css:
 * .band, .band-{platinum|gold|silver|bronze|provisional|unconfirmed|revoked|expired},
 * .band-score, .band-display, .band-statement, .band-caption.
 */
export type Band =
  | 'platinum'
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'provisional'
  | 'unconfirmed'
  | 'revoked'
  | 'expired';

const BAND_LABEL: Record<Band, string> = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  provisional: 'Provisional',
  unconfirmed: 'Unconfirmed',
  revoked: 'Revoked',
  expired: 'Expired',
};

export type ConfidenceBandProps = {
  band?: Band;
  score?: number;
  children?: React.ReactNode;
};

export function ConfidenceBand({ band = 'unconfirmed', score, children }: ConfidenceBandProps) {
  return (
    <span className={`band band-${band}`}>
      {children || BAND_LABEL[band]}
      {score != null && <span className="band-score"> · {score}</span>}
    </span>
  );
}

export type BandDisplayProps = {
  band?: Band;
  score?: number;
  statement?: React.ReactNode;
  caption?: React.ReactNode;
};

export function BandDisplay({ band = 'gold', score, statement, caption }: BandDisplayProps) {
  return (
    <div className="band-display">
      <ConfidenceBand band={band} score={score} />
      {statement && <div className="band-statement">{statement}</div>}
      {caption && <div className="band-caption">{caption}</div>}
    </div>
  );
}
