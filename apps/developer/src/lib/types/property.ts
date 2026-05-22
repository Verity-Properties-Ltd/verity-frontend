import type { Band } from '@/components/dashboard/BandPill';

export type PropertyStatus = 'verified' | 'in-verification' | 'awaiting-docs' | 'expiring' | 'expired';

export type PropertySummary = {
  vpid: string;
  address: string;
  city: string;
  band: Band;
  status: PropertyStatus;
  verifiedAt?: string;
  expiresAt?: string;
  views30d?: number;
  tier?: 'standard' | 'premium';
  /** Internal developer reference (e.g. LKI-A-12). */
  ref?: string;
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

export type PropertyDetail = PropertySummary & {
  sizeSqm: number;
  type: string;
  cityLong: string;
  sales: SalesMetadata;
  history: VerificationEvent[];
  distribution: DistributionEvent[];
};

export type CsvParsedRow = {
  index: number;
  address: string;
  type: string;
  state: string;
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
