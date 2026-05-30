import type { OverallResult, RiskRating } from '@dev/lib/types/property';

const RISK_LABEL: Record<RiskRating, string> = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
};

const RESULT_LABEL: Record<OverallResult, string> = {
  verified: 'Verified',
  conditional: 'Conditional',
  flagged: 'Flagged',
  pending: 'Pending',
};

export function RiskRatingPill({ rating }: { rating: RiskRating }) {
  return <span className={`dv-risk-pill tone-${rating}`}>{RISK_LABEL[rating]}</span>;
}

export function OverallResultPill({ result }: { result: OverallResult }) {
  return <span className={`dv-result-pill tone-${result}`}>{RESULT_LABEL[result]}</span>;
}
