import type {
  UICategory,
  UILandSubCategory,
  VerityNG_ApartmentStyle,
  VerityNG_BQConfig,
  VerityNG_HouseAttachment,
  VerityNG_HouseStyle,
  VerityNG_LandFeature,
} from '@verity/reso';

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
  // BQ rooms (Bathroom Standard v1.1 §4)
  Verity_NG_BQBedroomsTotal: number | null;
  Verity_NG_BQBathroomsFull: number | null;
  Verity_NG_BQBathroomsHalf: number | null;

  // Address Capture v1 — parsed RESO address fields.
  /** Combined "Street address" input — parsed into StreetNumber/Name/Suffix at submit. */
  streetAddressInput: string;
  /** Verity NG plot identifier — "Plot 14, Block 23". */
  Verity_NG_PlotNumber: string;
  /** Free-text neighbourhood or estate name (City vs Estate reconciliation deferred §5). */
  Verity_NG_Neighborhood: string;
  /** Flat / Apt / Unit number — RESO UnitNumber. */
  UnitNumber: string;
  /** City — free text in MVP per §5. */
  City: string;
  /** LGA. Cascading dropdown for the 36 states + FCT. */
  CountyOrParish: string;
  /** 37 values (36 states + FCT). */
  StateOrProvince: string;
  /** NIPOST 6-digit postal code. */
  PostalCode: string;

  LotSizeSquareMeters: number | null;
  /** Required for Residential House and for Apartment when style ≠ Studio. `5` represents "5+". */
  BedroomsTotal: number | null;
  /** Required for Residential House and for Apartment. `5` represents "5+". */
  BathroomsFull: number | null;
  /** Optional. A half bath has sink + toilet only. `3` represents "3+". */
  BathroomsHalf: number | null;

  // Documents / reference / tier
  documents: Partial<Record<DocumentSlot, DocumentMeta>>;
  ref: string;
  tier: VerificationTier;
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
  Verity_NG_BQBedroomsTotal: null,
  Verity_NG_BQBathroomsFull: null,
  Verity_NG_BQBathroomsHalf: null,

  streetAddressInput: '',
  Verity_NG_PlotNumber: '',
  Verity_NG_Neighborhood: '',
  UnitNumber: '',
  City: '',
  CountyOrParish: '',
  StateOrProvince: 'Lagos',
  PostalCode: '',
  LotSizeSquareMeters: null,
  BedroomsTotal: null,
  BathroomsFull: null,
  BathroomsHalf: null,

  documents: {},
  ref: '',
  tier: 'premium',
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
