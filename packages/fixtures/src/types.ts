export type SeedTier = 'standard' | 'premium';
export type SeedStatus = 'in-progress' | 'awaiting-action' | 'complete';
export type SeedPropertyType = 'residential' | 'commercial' | 'mixed-use' | 'land';
export type SeedBandTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'prov' | 'unconf';

export interface SeedDocument {
  name: string;
  size: number;
  type: string;
  ext: string;
}

/**
 * RESO Data Dictionary v2.0 — universal field types.
 * Brief: docs/VERITY_RESO_Adoption_Brief_v1.md
 *
 * 'Duplex' and 'Condominium' are deliberately excluded (§6.1 / §6.2).
 */
export type SeedRESOPropertyType    = 'Land' | 'Residential' | 'Commercial' | 'Farm';
export type SeedRESOPropertySubType =
  | 'SingleFamilyResidence' | 'Townhouse' | 'Apartment'
  | 'VacantLand' | 'CommercialLand' | 'AgriculturalLand';
export type SeedNGHouseStyle      = 'Bungalow' | 'Duplex' | 'Terrace';
export type SeedNGHouseAttachment = 'Detached' | 'SemiDetached';
export type SeedNGApartmentStyle  = 'Studio' | 'StandardFlat' | 'Penthouse' | 'Maisonette';
export type SeedNGLandZoning      = 'Residential' | 'Commercial' | 'MixedUse' | 'Industrial' | 'Agricultural';
export type SeedNGLandFeature     = 'Waterfront' | 'Reclaimed' | 'None';
export type SeedNGBQConfig        = 'Attached' | 'Detached' | 'Rooftop';

export interface SeedProperty {
  /** @deprecated kept for backward-compat; prefer PropertyType + PropertySubType. */
  type: SeedPropertyType;
  state: string;
  lga: string;
  address: string;
  plotNo?: string;
  sizeSqm?: number;

  // RESO universal
  PropertyType?:    SeedRESOPropertyType;
  PropertySubType?: SeedRESOPropertySubType;
  UnparsedAddress?: string;
  CountyOrParish?:  string;
  StateOrProvince?: string;
  LotSizeSquareMeters?: number;

  // Verity_NG_*
  Verity_NG_HouseStyle?:        SeedNGHouseStyle;
  Verity_NG_HouseAttachment?:   SeedNGHouseAttachment;
  Verity_NG_ApartmentStyle?:    SeedNGApartmentStyle;
  Verity_NG_LandZoning?:        SeedNGLandZoning;
  Verity_NG_LandFeature?:       SeedNGLandFeature;
  Verity_NG_HasBQ?:             boolean;
  Verity_NG_BQConfig?:          SeedNGBQConfig;
  Verity_NG_BQSeparateTitle?:   boolean;
  Verity_NG_BQBedroomsTotal?:   number;
  Verity_NG_BQBathroomsFull?:   number;
  Verity_NG_BQBathroomsHalf?:   number;

  // Address Capture v1 — parsed RESO street + locality
  StreetNumber?:                string;
  StreetNumberNumeric?:         number;
  StreetName?:                  string;
  StreetSuffix?:                string;
  UnitNumber?:                  string;
  City?:                        string;
  PostalCode?:                  string;
  Verity_NG_PlotNumber?:        string;
  Verity_NG_Neighborhood?:      string;
}

export interface SeedTrack {
  currentStage: number;
  completedDates: Record<number, string>;
  skipped: number[];
}

export interface SeedBand {
  tier: SeedBandTier;
  score: number;
  clarify?: string;
}

export interface SeedFlag {
  title: string;
  body: string;
  actionLabel?: string;
}

export interface SeedNote {
  from: string;
  at: string;
  body: string;
}

export interface SeedFinding {
  name: string;
  ref?: string;
  miss?: boolean;
}

export interface SeedWarning {
  title: string;
  body: string;
}

/**
 * A single verification fixture. Shape is intentionally a superset of what
 * any one app needs — each app projects to its own internal types.
 */
export interface VerificationSeed {
  vpid: string;
  address: string;
  city: string;
  tier: SeedTier;
  status: SeedStatus;
  createdAt: string;
  expectedAt?: string;
  property: SeedProperty;
  documents: SeedDocument[];
  track: SeedTrack;
  band?: SeedBand;
  flag?: SeedFlag;
  note?: SeedNote;
  findings?: SeedFinding[];
  warning?: SeedWarning;
}
