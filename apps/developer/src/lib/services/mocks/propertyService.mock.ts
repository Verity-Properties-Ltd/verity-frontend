import type { ActivityEvent, AttentionItem, BandTotals, DashboardSnapshot, KpiSnapshot, PropertySummary } from '@/lib/types/property';

const KPIS: KpiSnapshot = {
  total: 87,
  added: 4,
  inVerification: 6,
  inVerificationBreakdown: '3 awaiting docs · 3 in field',
  expiringSoon: 12,
  distributionViewsMtd: 1_284,
  distributionDeltaPct: 18,
};

const BANDS: BandTotals = {
  platinum: 8,
  gold: 41,
  silver: 22,
  bronze: 6,
  prov: 6,
  unconf: 4,
};

const ATTENTION: AttentionItem[] = [
  {
    id: 'docs-needed',
    kind: 'warn',
    emphasis: '3 properties',
    title: 'need additional documents',
    sub: 'Survey plans · CofO copies · Awaiting upload',
  },
  {
    id: 'expiring',
    kind: 'warn',
    emphasis: '12 verifications',
    title: 'expire within 90 days',
    sub: 'Refresh window open · Free for Founding 50',
  },
  {
    id: 'band-upgrade',
    kind: 'upgrade',
    emphasis: '2 properties',
    title: 'have new evidence — band upgrade available',
    sub: 'Court-cleared litigation · Silver → Gold candidates',
  },
];

const ACTIVITY: ActivityEvent[] = [
  { id: 'a1', when: '12 May · 08:42', kind: 'verification-refreshed', property: 'Lekki Block A · Plot 12', vpid: 'VRT-LA-2025-0184', band: 'gold' },
  { id: 'a2', when: '11 May · 16:08', kind: 'band-upgraded', property: 'Ikoyi Foreshore · Unit 7B', vpid: 'VRT-LA-2025-0151', band: 'gold', extra: 'Silver → Gold' },
  { id: 'a3', when: '11 May · 11:20', kind: 'certificate-issued', property: 'Victoria Island Tower II · Floor 14', vpid: 'VRT-LA-2025-0207', band: 'platinum' },
  { id: 'a4', when: '10 May · 14:55', kind: 'team-member-added', person: 'Tobi Adesina', role: 'Editor' },
  { id: 'a5', when: '09 May · 09:31', kind: 'verification-submitted', property: 'Banana Island · Villa 3', vpid: 'VRT-LA-2025-0212', band: 'prov' },
  { id: 'a6', when: '07 May · 17:02', kind: 'verification-expired', property: 'Surulere Block C · Plot 4', vpid: 'VRT-LA-2024-0089', band: 'unconf', extra: 'refresh available' },
];

const SPARKLINE = [28, 32, 24, 40, 36, 52, 44, 38, 46, 58, 42, 50, 56, 62, 48, 54, 68, 74, 60, 66, 82, 76, 84, 72, 78, 88, 94, 86, 92, 98];

const PROPERTIES: PropertySummary[] = [
  { vpid: 'VRT-LA-2025-0184', address: 'Lekki Block A · Plot 12', city: 'Lekki Phase 1', band: 'gold', status: 'verified', verifiedAt: '2025-08-14', expiresAt: '2026-08-14', views30d: 412, tier: 'premium' },
  { vpid: 'VRT-LA-2025-0151', address: 'Ikoyi Foreshore · Unit 7B', city: 'Ikoyi', band: 'gold', status: 'verified', verifiedAt: '2025-06-22', expiresAt: '2026-06-22', views30d: 287, tier: 'premium' },
  { vpid: 'VRT-LA-2025-0207', address: 'Victoria Island Tower II · Floor 14', city: 'Victoria Island', band: 'platinum', status: 'verified', verifiedAt: '2025-09-30', expiresAt: '2026-09-30', views30d: 318, tier: 'premium' },
  { vpid: 'VRT-LA-2025-0212', address: 'Banana Island · Villa 3', city: 'Banana Island', band: 'prov', status: 'in-verification', verifiedAt: undefined, views30d: 0, tier: 'premium' },
  { vpid: 'VRT-LA-2024-0089', address: 'Surulere Block C · Plot 4', city: 'Surulere', band: 'unconf', status: 'expired', verifiedAt: '2024-03-01', expiresAt: '2025-05-07', views30d: 12, tier: 'standard' },
];

export const propertyService = {
  async list(): Promise<PropertySummary[]> {
    await new Promise((r) => setTimeout(r, 120));
    return PROPERTIES;
  },

  async getDashboardSnapshot(): Promise<DashboardSnapshot> {
    await new Promise((r) => setTimeout(r, 150));
    return { kpis: KPIS, bands: BANDS, attention: ATTENTION, activity: ACTIVITY, sparkline: SPARKLINE };
  },
};
