import type {
  UICategory,
  UILandSubCategory,
  VerityNG_ApartmentStyle,
  VerityNG_BQConfig,
  VerityNG_HouseAttachment,
  VerityNG_HouseStyle,
  VerityNG_LandFeature,
} from '@verity/reso';

export type Tier = 'standard' | 'premium';
export type PaymentMethod = 'card' | 'bank';

export type DocumentMeta = {
  name: string;
  size: number;
  type: string;
  ext: string;
};

/**
 * Property payload carried through the buyer request wizard.
 *
 * Mirrors AddPropertyDraft on the developer side — UI category + Level 2
 * captures, RESO geo fields, BQ flow. The canonical RESO PropertyType /
 * PropertySubType is derived at submit time via derivePropertySubType().
 */
export type RequestProperty = {
  // Level 1 + Level 2 (brief §5)
  category: UICategory | null;
  landSubCategory: UILandSubCategory | null;
  landFeatures: VerityNG_LandFeature[];
  houseStyle: VerityNG_HouseStyle | null;
  houseAttachment: VerityNG_HouseAttachment | null;
  apartmentStyle: VerityNG_ApartmentStyle | null;

  // Boys' Quarters (brief §5.4)
  hasBQ: boolean;
  bqConfig: VerityNG_BQConfig | null;
  bqSeparateTitle: boolean;

  // RESO geography + apartment-specific
  UnparsedAddress: string;
  StateOrProvince: string;
  CountyOrParish: string;
  LotSizeSquareMeters?: number;
  /** Required for Residential House and for Apartment when style ≠ Studio. `5` represents "5+". */
  BedroomsTotal?: number;
  /** Required for Residential House and for Apartment. `5` represents "5+". */
  BathroomsFull?: number;
  /** Optional. A half bath has sink + toilet only. `3` represents "3+". */
  BathroomsHalf?: number;

  // Verity_* title
  Verity_PlotNo?: string;
};

export type RequestDraft = {
  property: RequestProperty;
  documents: DocumentMeta[];
  noDocuments: boolean;
  tier: Tier | null;
  payment: {
    method: PaymentMethod;
  };
};

export type RequestStatus = 'in-progress' | 'awaiting-action' | 'complete';

export type RequestSummary = {
  vpid: string;
  address: string;
  city: string;
  tier: Tier;
  status: RequestStatus;
  createdAt: string;
  expectedAt?: string;
};

export type RequestDetail = RequestSummary & {
  property: RequestProperty;
  documents: DocumentMeta[];
};

export const TIER_PRICE: Record<Tier, number> = {
  standard: 50_000,
  premium: 150_000,
};

export const TIER_LABEL: Record<Tier, string> = {
  standard: 'Standard',
  premium: 'Premium',
};

export const EMPTY_PROPERTY: RequestProperty = {
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
};

export const EMPTY_DRAFT: RequestDraft = {
  property: EMPTY_PROPERTY,
  documents: [],
  noDocuments: false,
  tier: null,
  payment: { method: 'card' },
};
