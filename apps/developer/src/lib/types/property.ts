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
