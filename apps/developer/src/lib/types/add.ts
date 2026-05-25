import type {
  UICategory,
  UILandSubCategory,
  VerityNG_ApartmentStyle,
  VerityNG_BQConfig,
  VerityNG_HouseAttachment,
  VerityNG_HouseStyle,
  VerityNG_LandFeature,
} from './reso';

/** @deprecated Pre-RESO category union. Removed once Phase 3 (wizard rebuild) lands. */
export type PropertyKind = 'land' | 'apartment' | 'villa' | 'commercial' | 'mixed-use';

export type DocumentSlot = 'cofo' | 'survey' | 'deed' | 'consent';

export type DocumentMeta = {
  name: string;
  size: number;
  type: string;
};

export type VerificationTier = 'standard' | 'premium';

/**
 * Wizard draft state.
 *
 * RESO fields (category + Level 2 + BQ + RESO geo) are the canonical capture.
 * The legacy fields (kind/address/state/lga/sizeSqm) remain present until the
 * Phase 3 wizard rebuild swaps them out — kept here so the pre-RESO Step 1
 * and Review pages still typecheck.
 *
 * At submit time, derivePropertySubType() converts (category + Level 2) into
 * canonical RESO PropertyType + PropertySubType.
 */
export type AddPropertyDraft = {
  step: number;

  // Level 1 + Level 2 (brief §5)
  category: UICategory | null;
  landSubCategory: UILandSubCategory | null;
  /** Multi-select to leave room for Phase 2; Phase 1 UI exposes single-select only. */
  landFeatures: VerityNG_LandFeature[];
  houseStyle: VerityNG_HouseStyle | null;
  houseAttachment: VerityNG_HouseAttachment | null;
  apartmentStyle: VerityNG_ApartmentStyle | null;

  // Boys' Quarters (brief §5.4) — applies to ResidentialHouse + ApartmentFlat
  hasBQ: boolean;
  bqConfig: VerityNG_BQConfig | null;
  bqSeparateTitle: boolean;

  // RESO geography
  UnparsedAddress: string;
  StateOrProvince: string;       // 'Lagos' default
  CountyOrParish: string;        // LGA
  LotSizeSquareMeters: number | null;

  // Documents / reference / tier
  documents: Partial<Record<DocumentSlot, DocumentMeta>>;
  ref: string;
  tier: VerificationTier;

  // ─── Legacy pre-RESO fields (removed in Phase 3) ──────────────────────
  /** @deprecated use `category` + derive */
  kind: PropertyKind | null;
  /** @deprecated use `UnparsedAddress` */
  address: string;
  /** @deprecated use `StateOrProvince` */
  state: string;
  /** @deprecated use `CountyOrParish` */
  lga: string;
  /** @deprecated use `LotSizeSquareMeters` */
  sizeSqm: number | null;
};

export const EMPTY_ADD_DRAFT: AddPropertyDraft = {
  step: 0,

  category: null,
  landSubCategory: null,
  landFeatures: [],
  houseStyle: null,
  houseAttachment: null,
  apartmentStyle: null,

  hasBQ: false,
  bqConfig: null,
  bqSeparateTitle: false,

  UnparsedAddress: '',
  StateOrProvince: 'Lagos',
  CountyOrParish: '',
  LotSizeSquareMeters: null,

  documents: {},
  ref: '',
  tier: 'premium',

  // legacy
  kind: null,
  address: '',
  state: 'Lagos State',
  lga: '',
  sizeSqm: null,
};

export const ADD_STEPS = [
  { slug: 'type',      num: '01', label: 'Property type & address' },
  { slug: 'documents', num: '02', label: 'Title documents' },
  { slug: 'reference', num: '03', label: 'Internal reference' },
  { slug: 'tier',      num: '04', label: 'Verification tier' },
  { slug: 'review',    num: '05', label: 'Review & submit' },
] as const;

export type StepSlug = (typeof ADD_STEPS)[number]['slug'];

export const DOCUMENT_LABELS: Record<DocumentSlot, { label: string; required: boolean; note: string }> = {
  cofo:    { label: 'Certificate of Occupancy (CofO)', required: true,  note: 'Drag file or click · raises confidence' },
  survey:  { label: 'Survey plan',                     required: true,  note: 'Drag file or click · matched to LasG records' },
  deed:    { label: 'Deed of assignment',              required: true,  note: 'Required · drag file or click' },
  consent: { label: "Governor's consent",              required: false, note: 'Optional · raises band to Gold' },
};
