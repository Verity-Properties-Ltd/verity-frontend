import type {
  ActivityEvent,
  AttentionItem,
  BandTotals,
  CsvParsedRow,
  CsvParseResult,
  DashboardSnapshot,
  DistributionEvent,
  KpiSnapshot,
  PropertyDetail,
  PropertySummary,
  VerificationEvent,
} from '@/lib/types/property';

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

const HISTORY_FALLBACK: VerificationEvent[] = [
  {
    id: 'v1', when: '12 MAY 2026 · 08:42 WAT', kind: 'refresh',
    title: 'Verification refreshed — band held at Gold',
    detail: 'All title evidence reverified. Court-cleared. No new liens detected. Certificate URL unchanged.',
    change: '⟲ REFRESH · 2,847 NGN · paid via cohort credit',
  },
  {
    id: 'v2', when: '14 NOV 2025 · 11:08 WAT', kind: 'band-upgrade',
    title: 'Band upgraded — Silver → Gold',
    detail: "Governor's consent received and verified. Boundary confirmed via Lagos State Lands Bureau.",
    change: '↑ BAND CHANGE · Silver → Gold',
  },
  {
    id: 'v3', when: '22 MAY 2025 · 16:24 WAT', kind: 'issued',
    title: 'First verification issued — Silver',
    detail: 'CofO authenticated. Survey plan matched LasG records. Field visit confirmed presence and demarcation.',
    change: '⊕ ISSUED · Silver band',
  },
  {
    id: 'v4', when: '02 MAY 2025 · 09:15 WAT', kind: 'submission',
    title: 'Submission received',
    detail: 'Submitted by Adeola Ogundipe. CofO + survey plan + deed of assignment uploaded.',
  },
];

const DISTRIBUTION_FALLBACK: DistributionEvent[] = [
  { id: 'd1', when: '11 May · 14:08', what: 'Public certificate viewed via', source: 'lekkiheights.com/lekki-block-a', channel: 'web' },
  { id: 'd2', when: '11 May · 11:42', what: 'PDF certificate downloaded by', source: 'sales@lekkiheights.com', channel: 'email' },
  { id: 'd3', when: '10 May · 16:55', what: 'Embed snippet rendered on', source: 'lekkiheights.com/inventory', channel: 'embed' },
  { id: 'd4', when: '09 May · 09:31', what: 'QR code scanned at', source: 'On-site signage · Plot 12', channel: 'qr' },
  { id: 'd5', when: '07 May · 14:02', what: 'Public certificate viewed via', source: 'verity.properties/v/VRT-LA-2025-0184', channel: 'direct' },
];

function detailFor(p: PropertySummary): PropertyDetail {
  return {
    ...p,
    sizeSqm: 1_250,
    type: 'Land',
    cityLong: `${p.city}, Lagos State`,
    sales: {
      reference: p.ref || 'LKI-A-12',
      status: p.status === 'verified' ? 'Active · listed' : 'Active · pending verification',
      listPrice: '₦ 165,000,000',
      buyer: '—',
      notes: 'Premium plot · waterfront access',
    },
    history: HISTORY_FALLBACK,
    distribution: DISTRIBUTION_FALLBACK,
  };
}

function fakeVpid(): string {
  const n = String(Math.floor(1_000 + Math.random() * 9_000));
  return `VRT-LA-2026-0${n}`;
}

export const propertyService = {
  async list(): Promise<PropertySummary[]> {
    await new Promise((r) => setTimeout(r, 120));
    return isEmptyMode() ? [] : PROPERTIES;
  },

  async get(vpid: string): Promise<PropertyDetail | null> {
    await new Promise((r) => setTimeout(r, 120));
    const summary = PROPERTIES.find((p) => p.vpid === vpid);
    return summary ? detailFor(summary) : null;
  },

  async submit(_draft: unknown): Promise<{ vpid: string }> {
    await new Promise((r) => setTimeout(r, 600));
    const vpid = fakeVpid();
    console.info('[mock] propertyService.submit', { vpid });
    return { vpid };
  },

  async parseCsv(file: File): Promise<CsvParseResult> {
    await new Promise((r) => setTimeout(r, 600));
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const rows: CsvParsedRow[] = lines.slice(1).map((line, i) => {
      const [addr, type, state, ref] = line.split(',').map((s) => s.trim());
      const validation: CsvParsedRow['validation'] =
        ref === 'SUR-C-04' ? { kind: 'dup', message: 'Duplicate of VRT-LA-2024-0089' } :
        addr?.toLowerCase().includes('banana') ? { kind: 'warn', message: 'Address ambiguous' } :
        { kind: 'ok' };
      return { index: i + 1, address: addr || '', type: type || '', state: state || 'Lagos', ref: ref || '', validation };
    });
    const ok = rows.filter((r) => r.validation.kind === 'ok').length;
    const warn = rows.filter((r) => r.validation.kind === 'warn').length;
    const dup = rows.filter((r) => r.validation.kind === 'dup').length;
    return { fileName: file.name, total: rows.length, ok, warn, dup, rows };
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
