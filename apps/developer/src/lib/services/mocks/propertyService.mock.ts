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
import type { AddPropertyDraft } from '@/lib/types/add';
import {
  buildUnparsedAddress,
  derivePropertySubType,
  parseStreetAddress,
  toSquareMeters,
  type DeriveInput,
  type RESOProperty,
} from '@verity/reso';

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

/**
 * RESO-shaped record + the display extras the existing UI consumes.
 *
 * Once the backend is wired, the RESOProperty side comes from the API and
 * the display extras are computed/joined client-side.
 */
type MockRecord = RESOProperty & Omit<PropertySummary, 'vpid' | 'address' | 'city'> & {
  /** Long-form city used on the property detail hero. */
  cityLong: string;
};

const PROPERTIES: MockRecord[] = [
  // ── Landed Property (4) — mix of zonings; one Waterfront ─────────────────
  {
    ListingKey: '8f3e2a10-0184-4ec7-aaaa-000000000001',
    Verity_VPID: 'VRT-LA-2025-0184',
    PropertyType: 'Land',
    PropertySubType: 'VacantLand',
    StandardStatus: 'Active',
    UnparsedAddress: 'Lekki Block A · Plot 12, Lekki Phase 1',
    StreetName: 'Lekki Block A',
    Verity_NG_PlotNumber: 'Plot 12',
    Verity_NG_Neighborhood: 'Lekki Phase 1',
    City: 'Lekki',
    PostalCode: '106104',
    CountyOrParish: 'Eti-Osa',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 1_250,
    Verity_NG_LandZoning: 'Residential',
    Verity_NG_LandFeature: 'Waterfront',
    Verity_LGA: 'Eti-Osa',
    Verity_TitleType: 'Certificate of Occupancy',
    Verity_CofONumber: 'LS/2019/047/A',
    Verity_RegisteredOwner: 'Adeola Ogundipe',
    Verity_TitleIssueDate: '2019-08-11',
    Verity_ConfidenceScore: 84,
    band: 'gold', status: 'verified', verifiedAt: '12 May 2026', expiresAt: '12 May 2027', tier: 'premium', ref: 'LKI-A-12',
    cityLong: 'Lekki Phase 1, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0312-4ec7-aaaa-000000000002',
    Verity_VPID: 'VRT-LA-2024-0312',
    PropertyType: 'Land',
    PropertySubType: 'VacantLand',
    StandardStatus: 'Active',
    UnparsedAddress: 'Lekki Block B · Plot 04, Lekki Phase 1',
    StreetName: 'Lekki Block B',
    Verity_NG_PlotNumber: 'Plot 04',
    Verity_NG_Neighborhood: 'Lekki Phase 1',
    City: 'Lekki',
    PostalCode: '106104',
    CountyOrParish: 'Eti-Osa',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 980,
    Verity_NG_LandZoning: 'MixedUse',
    Verity_NG_LandFeature: 'None',
    Verity_LGA: 'Eti-Osa',
    Verity_ConfidenceScore: 71,
    band: 'silver', status: 'verified', verifiedAt: '02 Apr 2026', expiresAt: '02 Apr 2027', tier: 'standard', ref: 'LKI-B-04',
    cityLong: 'Lekki Phase 1, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0089-4ec7-aaaa-000000000003',
    Verity_VPID: 'VRT-LA-2024-0089',
    PropertyType: 'Land',
    PropertySubType: 'CommercialLand',
    StandardStatus: 'Expired',
    UnparsedAddress: 'Surulere Block C · Plot 04, Surulere',
    StreetName: 'Surulere Block C',
    Verity_NG_PlotNumber: 'Plot 04',
    City: 'Surulere',
    PostalCode: '101283',
    CountyOrParish: 'Surulere',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 1_120,
    Verity_NG_LandZoning: 'Commercial',
    Verity_NG_LandFeature: 'None',
    Verity_LGA: 'Surulere',
    Verity_ConfidenceScore: 42,
    band: 'unconf', status: 'expired', verifiedAt: '07 May 2024', expiresAt: '07 May 2026', tier: 'standard', ref: 'SUR-C-04',
    cityLong: 'Surulere, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0143-4ec7-aaaa-000000000004',
    Verity_VPID: 'VRT-LA-2025-0143',
    PropertyType: 'Land',
    PropertySubType: 'AgriculturalLand',
    StandardStatus: 'Active',
    UnparsedAddress: 'Ajah Garden Estate · Plot 31, Ajah',
    Verity_NG_PlotNumber: 'Plot 31',
    Verity_NG_Neighborhood: 'Ajah Garden Estate',
    City: 'Ajah',
    PostalCode: '106104',
    CountyOrParish: 'Ibeju-Lekki',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 2_400,
    Verity_NG_LandZoning: 'Agricultural',
    Verity_NG_LandFeature: 'None',
    Verity_LGA: 'Ibeju-Lekki',
    Verity_ConfidenceScore: 68,
    band: 'silver', status: 'verified', verifiedAt: '08 Mar 2026', expiresAt: '08 Mar 2027', tier: 'standard', ref: 'AJG-31',
    cityLong: 'Ajah, Lagos State',
  },

  // ── Residential House (5) — mix of HouseStyle, one with BQ separate title
  {
    ListingKey: '8f3e2a10-0212-4ec7-bbbb-000000000005',
    Verity_VPID: 'VRT-LA-2025-0212',
    PropertyType: 'Residential',
    // Nigerian colloquial "Villa/Duplex" → RESO SingleFamilyResidence (§6.1)
    PropertySubType: 'SingleFamilyResidence',
    StandardStatus: 'Incomplete',
    UnparsedAddress: 'Banana Island · Villa 3, Foreshore Estate',
    StreetName: 'Villa 3',
    Verity_NG_Neighborhood: 'Banana Island',
    City: 'Ikoyi',
    PostalCode: '106104',
    CountyOrParish: 'Eti-Osa',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 1_240,
    BedroomsTotal: 5,
    BathroomsFull: 4,
    BathroomsHalf: 2,
    Verity_NG_HouseStyle: 'Duplex',
    Verity_NG_HouseAttachment: 'Detached',
    Verity_NG_HasBQ: true,
    Verity_NG_BQConfig: 'Detached',
    Verity_NG_BQSeparateTitle: true,
    Verity_NG_BQBedroomsTotal: 2,
    Verity_NG_BQBathroomsFull: 1,
    Verity_NG_BQBathroomsHalf: 0,
    Verity_LGA: 'Eti-Osa',
    Verity_ConfidenceScore: 28,
    band: 'prov', status: 'in-verification', tier: 'premium', ref: 'BNI-V03',
    cityLong: 'Banana Island, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0188-4ec7-bbbb-000000000006',
    Verity_VPID: 'VRT-LA-2025-0188',
    PropertyType: 'Residential',
    PropertySubType: 'SingleFamilyResidence',
    StandardStatus: 'Active',
    UnparsedAddress: 'Ikeja GRA · House 9, Ikeja GRA',
    StreetNumber: '9',
    StreetNumberNumeric: 9,
    StreetName: 'House',
    Verity_NG_Neighborhood: 'Ikeja GRA',
    City: 'Ikeja',
    PostalCode: '100271',
    CountyOrParish: 'Ikeja',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 860,
    BedroomsTotal: 4,
    BathroomsFull: 4,
    BathroomsHalf: 1,
    Verity_NG_HouseStyle: 'Duplex',
    Verity_NG_HouseAttachment: 'SemiDetached',
    Verity_NG_HasBQ: true,
    Verity_NG_BQConfig: 'Attached',
    Verity_NG_BQSeparateTitle: false,
    Verity_NG_BQBedroomsTotal: 1,
    Verity_NG_BQBathroomsFull: 1,
    Verity_NG_BQBathroomsHalf: 0,
    Verity_LGA: 'Ikeja',
    Verity_ConfidenceScore: 92,
    band: 'platinum', status: 'verified', verifiedAt: '01 May 2026', expiresAt: '01 May 2028', tier: 'premium', ref: 'IKJ-GRA-9',
    cityLong: 'Ikeja GRA, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0218-4ec7-bbbb-000000000007',
    Verity_VPID: 'VRT-LA-2025-0218',
    PropertyType: 'Residential',
    PropertySubType: 'SingleFamilyResidence',
    StandardStatus: 'Incomplete',
    UnparsedAddress: 'Chevron Drive · Villa 11, Lekki Phase 2',
    StreetName: 'Chevron',
    StreetSuffix: 'Drive',
    Verity_NG_PlotNumber: 'Villa 11',
    Verity_NG_Neighborhood: 'Lekki Phase 2',
    City: 'Lekki',
    PostalCode: '106104',
    CountyOrParish: 'Eti-Osa',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 1_080,
    BedroomsTotal: 5,
    BathroomsFull: 5,
    BathroomsHalf: 1,
    Verity_NG_HouseStyle: 'Bungalow',
    Verity_NG_HouseAttachment: 'Detached',
    Verity_NG_HasBQ: false,
    Verity_LGA: 'Eti-Osa',
    Verity_ConfidenceScore: 24,
    band: 'prov', status: 'in-verification', tier: 'premium', ref: 'CHV-V11',
    cityLong: 'Lekki Phase 2, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0162-4ec7-bbbb-000000000008',
    Verity_VPID: 'VRT-LA-2025-0162',
    PropertyType: 'Residential',
    PropertySubType: 'Townhouse',
    StandardStatus: 'Active',
    UnparsedAddress: 'Magodo Phase II · Plot 18, Magodo',
    Verity_NG_PlotNumber: 'Plot 18',
    Verity_NG_Neighborhood: 'Magodo Phase II',
    City: 'Magodo',
    PostalCode: '105102',
    CountyOrParish: 'Kosofe',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 540,
    BedroomsTotal: 4,
    BathroomsFull: 4,
    BathroomsHalf: 0,
    Verity_NG_HouseStyle: 'Terrace',
    Verity_NG_HouseAttachment: 'SemiDetached',
    Verity_NG_HasBQ: false,
    Verity_LGA: 'Kosofe',
    Verity_ConfidenceScore: 80,
    band: 'gold', status: 'verified', verifiedAt: '22 Mar 2026', expiresAt: '22 Mar 2027', tier: 'premium', ref: 'MGD-2-18',
    cityLong: 'Magodo, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0201-4ec7-bbbb-000000000009',
    Verity_VPID: 'VRT-LA-2025-0201',
    PropertyType: 'Residential',
    PropertySubType: 'Townhouse',
    StandardStatus: 'Active',
    UnparsedAddress: 'Oniru Estate · Block D · Plot 7, Victoria Island',
    Verity_NG_PlotNumber: 'Block D · Plot 7',
    Verity_NG_Neighborhood: 'Oniru Estate',
    City: 'Victoria Island',
    PostalCode: '101241',
    CountyOrParish: 'Eti-Osa',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 480,
    BedroomsTotal: 3,
    BathroomsFull: 3,
    BathroomsHalf: 1,
    Verity_NG_HouseStyle: 'Terrace',
    Verity_NG_HouseAttachment: 'Detached',
    Verity_NG_HasBQ: false,
    Verity_LGA: 'Eti-Osa',
    Verity_ConfidenceScore: 58,
    band: 'bronze', status: 'verified', verifiedAt: '05 May 2026', expiresAt: '05 May 2027', tier: 'standard', ref: 'ONI-D-07',
    cityLong: 'Victoria Island, Lagos State',
  },

  // ── Apartment / Flat (3) — mix of ApartmentStyle ─────────────────────────
  {
    ListingKey: '8f3e2a10-0151-4ec7-cccc-000000000010',
    Verity_VPID: 'VRT-LA-2025-0151',
    PropertyType: 'Residential',
    PropertySubType: 'Apartment',
    StandardStatus: 'Active',
    UnparsedAddress: 'Ikoyi Foreshore · Unit 7B, Ikoyi',
    UnitNumber: '7B',
    Verity_NG_Neighborhood: 'Ikoyi Foreshore',
    City: 'Ikoyi',
    PostalCode: '106104',
    CountyOrParish: 'Eti-Osa',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 180,
    BedroomsTotal: 3,
    BathroomsFull: 3,
    BathroomsHalf: 0,
    Verity_NG_ApartmentStyle: 'StandardFlat',
    Verity_NG_HasBQ: false,
    Verity_LGA: 'Eti-Osa',
    Verity_ConfidenceScore: 82,
    band: 'gold', status: 'verified', verifiedAt: '11 May 2026', expiresAt: '11 May 2027', tier: 'premium', ref: 'IKY-FS-07B',
    cityLong: 'Ikoyi, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0207-4ec7-cccc-000000000011',
    Verity_VPID: 'VRT-LA-2025-0207',
    PropertyType: 'Residential',
    PropertySubType: 'Apartment',
    StandardStatus: 'Active',
    UnparsedAddress: 'Victoria Island Tower II · Floor 14, Victoria Island',
    UnitNumber: 'Floor 14',
    Verity_NG_Neighborhood: 'Victoria Island Tower II',
    City: 'Victoria Island',
    PostalCode: '101241',
    CountyOrParish: 'Eti-Osa',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 240,
    BedroomsTotal: 4,
    BathroomsFull: 4,
    BathroomsHalf: 0,
    Verity_NG_ApartmentStyle: 'Penthouse',
    Verity_NG_HasBQ: true,
    Verity_NG_BQConfig: 'Rooftop',
    Verity_NG_BQSeparateTitle: false,
    Verity_NG_BQBedroomsTotal: 1,
    Verity_NG_BQBathroomsFull: 1,
    Verity_NG_BQBathroomsHalf: 0,
    Verity_LGA: 'Eti-Osa',
    Verity_ConfidenceScore: 94,
    band: 'platinum', status: 'verified', verifiedAt: '11 May 2026', expiresAt: '11 May 2028', tier: 'premium', ref: 'VI-T2-14',
    cityLong: 'Victoria Island, Lagos State',
  },
  {
    ListingKey: '8f3e2a10-0099-4ec7-cccc-000000000012',
    Verity_VPID: 'VRT-LA-2025-0099',
    PropertyType: 'Residential',
    PropertySubType: 'Apartment',
    StandardStatus: 'Active',
    UnparsedAddress: 'Yaba Heights · Unit 22, Yaba',
    UnitNumber: '22',
    Verity_NG_Neighborhood: 'Yaba Heights',
    City: 'Yaba',
    PostalCode: '101212',
    CountyOrParish: 'Lagos Mainland',
    StateOrProvince: 'Lagos',
    Country: 'NG',
    LotSizeSquareMeters: 95,
    BedroomsTotal: 0,
    BathroomsFull: 1,
    BathroomsHalf: 0,
    Verity_NG_ApartmentStyle: 'Studio',
    Verity_NG_HasBQ: false,
    Verity_LGA: 'Lagos Mainland',
    Verity_ConfidenceScore: 76,
    band: 'gold', status: 'expiring', verifiedAt: '14 Jan 2026', expiresAt: '14 Jul 2026', tier: 'premium', ref: 'YBH-22',
    cityLong: 'Yaba, Lagos State',
  },
];

const EMPTY_KEY = 'verity:dev-portfolio-empty';

function isEmptyMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(EMPTY_KEY) === 'true';
}

/**
 * Project a RESO MockRecord into the legacy PropertySummary shape consumed
 * by the portfolio table. Phase 4 swaps the table to read RESO fields
 * directly, after which this helper goes away.
 */
function toSummary(r: MockRecord): PropertySummary {
  return {
    vpid: r.Verity_VPID,
    address: r.UnparsedAddress.split(',')[0].trim(),
    city: r.CountyOrParish,
    band: r.band,
    status: r.status,
    verifiedAt: r.verifiedAt,
    expiresAt: r.expiresAt,
    views30d: r.views30d,
    tier: r.tier,
    ref: r.ref,
    PropertyType: r.PropertyType,
    Verity_NG_HouseStyle: r.Verity_NG_HouseStyle,
    Verity_NG_ApartmentStyle: r.Verity_NG_ApartmentStyle,
    Verity_NG_LandZoning: r.Verity_NG_LandZoning,
    Verity_NG_LandFeature: r.Verity_NG_LandFeature,
    Verity_NG_HasBQ: r.Verity_NG_HasBQ,
  };
}

/** Map RESO PropertySubType + Verity_NG_* style to a human display string. */
function displayType(r: MockRecord): string {
  if (r.PropertyType === 'Land') {
    if (r.Verity_NG_LandZoning && r.Verity_NG_LandZoning !== 'Residential') {
      return `Land · ${r.Verity_NG_LandZoning}`;
    }
    return 'Land';
  }
  if (r.PropertySubType === 'Apartment' && r.Verity_NG_ApartmentStyle) {
    return `Apartment · ${r.Verity_NG_ApartmentStyle}`;
  }
  if (r.Verity_NG_HouseStyle) return r.Verity_NG_HouseStyle;
  return r.PropertyType;
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

function detailFor(r: MockRecord): PropertyDetail {
  return {
    // PropertySummary fields
    ...toSummary(r),
    // RESO fields (spread directly so detail consumers can read them)
    ...r,
    // legacy display extras (kept until Phase 4 detail rewrite)
    sizeSqm: r.LotSizeSquareMeters ?? 0,
    type: displayType(r),
    cityLong: r.cityLong,
    sales: {
      reference: r.ref || r.Verity_VPID,
      status: r.status === 'verified' ? 'Active · listed' : 'Active · pending verification',
      listPrice: '₦ 165,000,000',
      buyer: '—',
      notes: r.Verity_NG_LandFeature === 'Waterfront' ? 'Premium plot · waterfront access' : '—',
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
    return isEmptyMode() ? [] : PROPERTIES.map(toSummary);
  },

  async get(vpid: string): Promise<PropertyDetail | null> {
    await new Promise((r) => setTimeout(r, 120));
    const record = PROPERTIES.find((p) => p.Verity_VPID === vpid);
    return record ? detailFor(record) : null;
  },

  async submit(draft: AddPropertyDraft): Promise<{ vpid: string }> {
    await new Promise((r) => setTimeout(r, 600));
    const vpid = fakeVpid();

    // Build a RESO-shaped payload from the wizard draft. Once the backend is
    // wired this is what the POST /api/v1/properties request body will look
    // like (brief §9.1). The derive call here mirrors the same one running
    // in the wizard so an invalid combo is impossible to submit.
    const derive: DeriveInput | null =
      draft.category === 'LandedProperty' && draft.landSubCategory
        ? { category: 'LandedProperty', landSubCategory: draft.landSubCategory }
      : draft.category === 'ResidentialHouse' && draft.houseStyle && draft.houseAttachment
        ? { category: 'ResidentialHouse', houseStyle: draft.houseStyle, attachment: draft.houseAttachment }
      : draft.category === 'ApartmentFlat' && draft.apartmentStyle
        ? { category: 'ApartmentFlat', apartmentStyle: draft.apartmentStyle }
      : null;

    const derived = derive ? derivePropertySubType(derive) : null;

    // Studio implies 0 bedrooms + 1 full bath (RESO §5.3 standard layout).
    const isStudio = draft.category === 'ApartmentFlat' && draft.apartmentStyle === 'Studio';
    const bedrooms        = isStudio ? 0 : draft.BedroomsTotal ?? undefined;
    const bathsFull       = isStudio ? 1 : draft.BathroomsFull ?? undefined;
    const bathsHalf       = isStudio ? 0 : draft.BathroomsHalf ?? undefined;
    // Derived per Bathroom Standard v1.1 §3 — backend trigger owns canonical correctness.
    const bathsTotalInt   = bathsFull != null ? bathsFull + (bathsHalf ?? 0)       : undefined;
    const bathsTotalDec   = bathsFull != null ? bathsFull + (bathsHalf ?? 0) * 0.5 : undefined;

    // Address Capture v1 — parse the combined street input into RESO parts,
    // then compose UnparsedAddress server-side equivalent (§7.2).
    const street = parseStreetAddress(draft.streetAddressInput);
    const addressForCompose = {
      StreetNumber: street.StreetNumber,
      StreetName: street.StreetName,
      StreetSuffix: street.StreetSuffix,
      UnitNumber: draft.UnitNumber || undefined,
      Verity_NG_PlotNumber: draft.Verity_NG_PlotNumber || undefined,
      Verity_NG_Neighborhood: draft.Verity_NG_Neighborhood || undefined,
      City: draft.City || undefined,
      CountyOrParish: draft.CountyOrParish || undefined,
      StateOrProvince: draft.StateOrProvince || undefined,
    };

    const payload: Partial<RESOProperty> = {
      Verity_VPID: vpid,
      PropertyType: derived?.PropertyType,
      PropertySubType: derived?.PropertySubType,
      StandardStatus: 'Incomplete',
      // Parsed RESO street components
      StreetNumber: street.StreetNumber,
      StreetNumberNumeric: street.StreetNumberNumeric,
      StreetName: street.StreetName,
      StreetSuffix: street.StreetSuffix,
      UnitNumber: draft.UnitNumber || undefined,
      // Composed display string
      UnparsedAddress: buildUnparsedAddress(addressForCompose),
      // Locality
      City: draft.City || undefined,
      CountyOrParish: draft.CountyOrParish,
      StateOrProvince: draft.StateOrProvince,
      Country: 'NG',
      PostalCode: draft.PostalCode || undefined,
      // Area & Measurement v1 §2.1 — Lot size (Land + House only)
      LotSizeArea:        draft.LotSizeArea ?? undefined,
      LotSizeUnits:       draft.LotSizeUnits ?? undefined,
      LotSizeDimensions:  draft.LotSizeDimensions || undefined,
      LotSizeSource:      draft.LotSizeSource ?? undefined,
      // §5.3 derived sqm — mirrors the future generated column
      LotSizeSquareMeters:
        draft.LotSizeArea && draft.LotSizeUnits
          ? toSquareMeters(draft.LotSizeArea, draft.LotSizeUnits)
          : undefined,
      // §2.2 — Living area (House + Apartment only); sqm implicit per §8.3
      LivingArea:                  draft.LivingArea ?? undefined,
      LivingAreaUnits:             draft.LivingArea != null ? 'SquareMeters' : undefined,
      LivingAreaSource:            draft.LivingAreaSource ?? undefined,
      // §2.3 — AboveGradeFinishedArea mirrors LivingArea (no basements in NG)
      AboveGradeFinishedArea:      draft.LivingArea ?? undefined,
      AboveGradeFinishedAreaUnits: draft.LivingArea != null ? 'SquareMeters' : undefined,
      BedroomsTotal: bedrooms,
      BathroomsFull: bathsFull,
      BathroomsHalf: bathsHalf,
      BathroomsTotalInteger: bathsTotalInt,
      BathroomsTotalDecimal: bathsTotalDec,
      Verity_NG_LandZoning: derived?.Verity_NG_LandZoning,
      Verity_NG_LandFeature: draft.landFeatures[0] ?? 'None',
      Verity_NG_HouseStyle: draft.houseStyle ?? undefined,
      Verity_NG_HouseAttachment: draft.houseAttachment ?? undefined,
      Verity_NG_ApartmentStyle: draft.apartmentStyle ?? undefined,
      Verity_NG_PlotNumber: draft.Verity_NG_PlotNumber || undefined,
      Verity_NG_Neighborhood: draft.Verity_NG_Neighborhood || undefined,
      Verity_NG_HasBQ: draft.hasBQ,
      Verity_NG_BQConfig: draft.bqConfig ?? undefined,
      Verity_NG_BQSeparateTitle: draft.bqSeparateTitle,
      Verity_NG_BQBedroomsTotal:  draft.hasBQ ? draft.Verity_NG_BQBedroomsTotal ?? 0 : undefined,
      Verity_NG_BQBathroomsFull:  draft.hasBQ ? draft.Verity_NG_BQBathroomsFull ?? 0 : undefined,
      Verity_NG_BQBathroomsHalf:  draft.hasBQ ? draft.Verity_NG_BQBathroomsHalf ?? 0 : undefined,
    };

    console.info('[mock] propertyService.submit — RESO payload', payload);
    return { vpid };
  },

  async parseCsv(file: File): Promise<CsvParseResult> {
    await new Promise((r) => setTimeout(r, 600));
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const header = (lines[0] || '').split(',').map((s) => s.trim());
    const idx = (k: string) => header.indexOf(k);
    const rows: CsvParsedRow[] = lines.slice(1).map((line, i) => {
      const cells = line.split(',').map((s) => s.trim());
      const get = (k: string) => (idx(k) >= 0 ? cells[idx(k)] : '');
      const ref = get('ref');
      const addr = get('UnparsedAddress');
      const sizeRaw = get('LotSizeSquareMeters');
      const validation: CsvParsedRow['validation'] =
        ref === 'SUR-C-04' ? { kind: 'dup', message: 'Duplicate of VRT-LA-2024-0089' } :
        addr?.toLowerCase().includes('banana') ? { kind: 'warn', message: 'Address ambiguous' } :
        { kind: 'ok' };
      return {
        index: i + 1,
        UnparsedAddress: addr || '',
        PropertyType: get('PropertyType') || '',
        PropertySubType: get('PropertySubType') || undefined,
        StateOrProvince: get('StateOrProvince') || 'Lagos',
        CountyOrParish: get('CountyOrParish') || undefined,
        Verity_NG_HouseStyle: get('Verity_NG_HouseStyle') || undefined,
        Verity_NG_LandZoning: get('Verity_NG_LandZoning') || undefined,
        LotSizeSquareMeters: sizeRaw ? Number(sizeRaw) : undefined,
        ref: ref || '',
        validation,
      };
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
