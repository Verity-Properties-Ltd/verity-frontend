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
  { id: 'docs-needed',  kind: 'warn',    emphasis: '3 properties',     title: 'need additional documents', sub: 'Survey plans · CofO copies · Awaiting upload' },
  { id: 'expiring',     kind: 'warn',    emphasis: '12 verifications', title: 'expire within 90 days',     sub: 'Refresh window open · Free for Founding 50' },
  { id: 'band-upgrade', kind: 'upgrade', emphasis: '2 properties',     title: 'have new evidence — band upgrade available', sub: 'Court-cleared litigation · Silver → Gold candidates' },
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
  { vpid: 'VRT-LA-2025-0184', address: 'Lekki Block A · Plot 12',           city: 'Lekki Phase 1',    band: 'gold',     status: 'verified',       verifiedAt: '12 May 2026', expiresAt: '12 May 2027', tier: 'premium', ref: 'LKI-A-12' },
  { vpid: 'VRT-LA-2025-0151', address: 'Ikoyi Foreshore · Unit 7B',         city: 'Ikoyi',            band: 'gold',     status: 'verified',       verifiedAt: '11 May 2026', expiresAt: '11 May 2027', tier: 'premium', ref: 'IKY-FS-07B' },
  { vpid: 'VRT-LA-2025-0207', address: 'Victoria Island Tower II · Fl. 14', city: 'Victoria Island',  band: 'platinum', status: 'verified',       verifiedAt: '11 May 2026', expiresAt: '11 May 2028', tier: 'premium', ref: 'VI-T2-14' },
  { vpid: 'VRT-LA-2025-0212', address: 'Banana Island · Villa 3',           city: 'Banana Island',    band: 'prov',     status: 'in-verification', tier: 'premium', ref: 'BNI-V03' },
  { vpid: 'VRT-LA-2024-0312', address: 'Lekki Block B · Plot 04',           city: 'Lekki Phase 1',    band: 'silver',   status: 'verified',       verifiedAt: '02 Apr 2026', expiresAt: '02 Apr 2027', tier: 'standard', ref: 'LKI-B-04' },
  { vpid: 'VRT-LA-2024-0089', address: 'Surulere Block C · Plot 04',        city: 'Surulere',         band: 'unconf',   status: 'expired',        verifiedAt: '07 May 2024', expiresAt: '07 May 2026', tier: 'standard', ref: 'SUR-C-04' },
  { vpid: 'VRT-LA-2025-0099', address: 'Yaba Heights · Unit 22',            city: 'Yaba',             band: 'gold',     status: 'expiring',       verifiedAt: '14 Jan 2026', expiresAt: '14 Jul 2026', tier: 'premium', ref: 'YBH-22' },
  { vpid: 'VRT-LA-2025-0143', address: 'Ajah Garden Estate · Plot 31',      city: 'Ajah',             band: 'silver',   status: 'verified',       verifiedAt: '08 Mar 2026', expiresAt: '08 Mar 2027', tier: 'standard', ref: 'AJG-31' },
  { vpid: 'VRT-LA-2025-0162', address: 'Magodo Phase II · Plot 18',         city: 'Magodo',           band: 'gold',     status: 'verified',       verifiedAt: '22 Mar 2026', expiresAt: '22 Mar 2027', tier: 'premium', ref: 'MGD-2-18' },
  { vpid: 'VRT-LA-2025-0188', address: 'Ikeja GRA · House 9',               city: 'Ikeja',            band: 'platinum', status: 'verified',       verifiedAt: '01 May 2026', expiresAt: '01 May 2028', tier: 'premium', ref: 'IKJ-GRA-9' },
  { vpid: 'VRT-LA-2025-0201', address: 'Oniru Estate · Block D · Plot 7',   city: 'Victoria Island',  band: 'bronze',   status: 'verified',       verifiedAt: '05 May 2026', expiresAt: '05 May 2027', tier: 'standard', ref: 'ONI-D-07' },
  { vpid: 'VRT-LA-2025-0218', address: 'Chevron Drive · Villa 11',          city: 'Lekki Phase 2',    band: 'prov',     status: 'in-verification', tier: 'premium', ref: 'CHV-V11' },
];

const EMPTY_KEY = 'verity:dev-portfolio-empty';

function isEmptyMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(EMPTY_KEY) === 'true';
}

export const propertyService = {
  async list(): Promise<PropertySummary[]> {
    await new Promise((r) => setTimeout(r, 120));
    return isEmptyMode() ? [] : PROPERTIES;
  },

  async getDashboardSnapshot(): Promise<DashboardSnapshot> {
    await new Promise((r) => setTimeout(r, 150));
    return { kpis: KPIS, bands: BANDS, attention: ATTENTION, activity: ACTIVITY, sparkline: SPARKLINE };
  },

  setEmptyMode(empty: boolean): void {
    if (typeof window === 'undefined') return;
    if (empty) window.localStorage.setItem(EMPTY_KEY, 'true');
    else window.localStorage.removeItem(EMPTY_KEY);
  },

  isEmptyMode,
};
