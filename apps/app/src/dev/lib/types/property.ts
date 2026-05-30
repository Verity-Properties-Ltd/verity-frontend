import type { Band } from '@dev/components/dashboard/BandPill';
import type { RESOProperty } from '@verity/reso';

export type PropertyStatus =
  | 'draft'
  | 'verified' | 'in-verification' | 'awaiting-docs' | 'expiring' | 'expired';

export type PropertySummary = {
  vpid: string;
  address: string;
  city: string;
  band: Band;
  status: PropertyStatus;
  verifiedAt?: string;
  expiresAt?: string;
  /** ISO timestamp — used to sort drafts at the top of the portfolio. */
  createdAt?: string;
  views30d?: number;
  tier?: 'standard' | 'premium';
  /** Internal developer reference (e.g. LKI-A-12). */
  ref?: string;
  // Subset of RESO + Verity_NG_* surfaced as secondary tags on the
  // portfolio row (brief §9.5).
  PropertyType?: RESOProperty['PropertyType'];
  Verity_NG_HouseStyle?: RESOProperty['Verity_NG_HouseStyle'];
  Verity_NG_ApartmentStyle?: RESOProperty['Verity_NG_ApartmentStyle'];
  Verity_NG_LandZoning?: RESOProperty['Verity_NG_LandZoning'];
  Verity_NG_LandFeature?: RESOProperty['Verity_NG_LandFeature'];
  Verity_NG_HasBQ?: boolean;
};

export type BandTotals = Record<Band, number>;

export type KpiSnapshot = {
  total: number;
  added: number;
  inVerification: number;
  inVerificationBreakdown: string;
  expiringSoon: number;
  distributionViewsMtd: number;
  distributionDeltaPct: number;
};

export type AttentionItem = {
  id: string;
  kind: 'warn' | 'upgrade';
  title: string;
  sub: string;
  emphasis?: string;
  href?: string;
};

export type ActivityEvent =
  | { id: string; when: string; kind: 'verification-refreshed' | 'band-upgraded' | 'certificate-issued' | 'verification-submitted' | 'verification-expired'; property: string; vpid: string; band: Band; extra?: string }
  | { id: string; when: string; kind: 'team-member-added'; person: string; role: string };

export type DashboardSnapshot = {
  kpis: KpiSnapshot;
  bands: BandTotals;
  attention: AttentionItem[];
  activity: ActivityEvent[];
  /** 30 daily values for the distribution sparkline. */
  sparkline: number[];
};

export type VerificationEvent = {
  id: string;
  when: string;
  kind: 'refresh' | 'band-upgrade' | 'issued' | 'submission';
  title: React.ReactNode;
  detail: string;
  change?: string;
};

export type DistributionEvent = {
  id: string;
  when: string;
  what: string;
  source: string;
  channel: 'web' | 'email' | 'embed' | 'qr' | 'direct';
};

export type SalesMetadata = {
  reference: string;
  status: string;
  listPrice?: string;
  buyer?: string;
  notes?: string;
};

/** Eight-stage workflow per PRD v2.1 §14.3 collapsed to a five-step status tracker
 *  for the developer-facing surface (UI/UX v1.3 §5.6). */
export type VerificationStep = 'uploaded' | 'under-review' | 'ai-processing' | 'analyst-review' | 'complete';

export type RiskRating = 'low' | 'medium' | 'high';

export type OverallResult = 'verified' | 'conditional' | 'flagged' | 'pending';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type VerificationCheck = {
  /** Stable id for keying. */
  id: string;
  /** Display name (one of the five evidence workstreams — title, ownership,
   *  encumbrance, survey, risk — per UI/UX §7.2). */
  name: string;
  description: string;
  result: 'pass' | 'fail' | 'pending';
};

export type ExtractedField = {
  field: string;
  value: string;
  confidence: ConfidenceLevel;
};

/** The verification workflow snapshot rendered on a property's Verification tab.
 *  Sourced from the analyst console once the backend is wired (PRD §5.5); for
 *  now seeded from fixtures so the developer surface has UI parity with mvp. */
export type VerificationWorkflow = {
  currentStep: VerificationStep;
  estimatedCompletion?: string;
  riskRating: RiskRating;
  overallResult: OverallResult;
  summary: string;
  avmValue: string;
  avmConfidence: number;
  checks: VerificationCheck[];
  extractedFields: ExtractedField[];
  analystNotes: string;
  /** Internal analyst reference, e.g. VRT-ANA-0042. */
  analystRef: string;
};

/**
 * Detailed property record.
 *
 * Carries the full RESO + Verity_NG_* + Verity_* surface (via Partial — not
 * every mock has every field). Display surfaces should prefer the RESO
 * field names; legacy `address`/`city`/`type` projections are kept on
 * PropertySummary for the portfolio table until Phase 4 swaps it.
 */
export type PropertyDetail = PropertySummary & Partial<RESOProperty> & {
  sizeSqm: number;
  type: string;
  cityLong: string;
  sales: SalesMetadata;
  history: VerificationEvent[];
  distribution: DistributionEvent[];
  /** Most-recent verification workflow snapshot. Omitted for draft properties
   *  that have never been submitted; otherwise present even while pending. */
  workflow?: VerificationWorkflow;
};

export type CsvParsedRow = {
  index: number;
  UnparsedAddress: string;
  PropertyType: string;
  PropertySubType?: string;
  StateOrProvince: string;
  CountyOrParish?: string;
  Verity_NG_HouseStyle?: string;
  Verity_NG_LandZoning?: string;
  LotSizeSquareMeters?: number;
  ref: string;
  validation: { kind: 'ok' } | { kind: 'warn'; message: string } | { kind: 'dup'; message: string };
};

export type CsvParseResult = {
  fileName: string;
  total: number;
  ok: number;
  warn: number;
  dup: number;
  rows: CsvParsedRow[];
};
