/**
 * @verity/reso — RESO Data Dictionary v2.0 type system.
 *
 * Shared by every VERITY app (developer dashboard, buyer flow) and any
 * future workspace. The buyer requesting a verification and the developer
 * filing one capture the same canonical schema; the API will too.
 *
 * Spec: docs/VERITY_RESO_Adoption_Brief_v1.md
 *
 * Two namespaces:
 *   - RESO_*    — universal field/enum values defined by RESO
 *   - Verity_NG_* / Verity_* — country-specific (Nigeria) custom additions
 *
 * The union RESO_PropertySubType DELIBERATELY excludes 'Duplex' and
 * 'Condominium' (brief §6.1 / §6.2) — adding either to a literal of type
 * RESOProperty produces TS2322. This is the frontend mirror of the
 * `chk_no_reso_duplex` / `chk_no_condominium` PostgreSQL constraints.
 */

// ───────────────────────────────────────────────────────────────────────────
// RESO universal enums
// ───────────────────────────────────────────────────────────────────────────

export type RESO_PropertyType = 'Land' | 'Residential' | 'Commercial' | 'Farm';

export type RESO_PropertySubType =
  | 'SingleFamilyResidence'
  | 'Townhouse'
  | 'Apartment'
  | 'VacantLand'
  | 'CommercialLand'
  | 'AgriculturalLand';

// Compile-time guard. If a future edit ever loosens RESO_PropertySubType to
// include 'Duplex' or 'Condominium', RESO_SubTypeIntegrity collapses to
// `never`, and any consumer importing it will fail typecheck. See §6.
type _AssertNoDuplex      = [Extract<RESO_PropertySubType, 'Duplex'>]      extends [never] ? true : false;
type _AssertNoCondominium = [Extract<RESO_PropertySubType, 'Condominium'>] extends [never] ? true : false;
export type RESO_SubTypeIntegrity = _AssertNoDuplex & _AssertNoCondominium;
const _resoSubTypeIntegrityCheck: RESO_SubTypeIntegrity = true;
void _resoSubTypeIntegrityCheck;

export type RESO_StandardStatus =
  | 'Active'
  | 'ActiveUnderContract'
  | 'Pending'
  | 'Sold'
  | 'Expired'
  | 'Withdrawn'
  | 'Cancelled'
  | 'Incomplete';

// ───────────────────────────────────────────────────────────────────────────
// Verity_NG_* — Nigeria-specific custom unions
// ───────────────────────────────────────────────────────────────────────────

export type VerityNG_HouseStyle      = 'Bungalow' | 'Duplex' | 'Terrace';
export type VerityNG_HouseAttachment = 'Detached' | 'SemiDetached';
export type VerityNG_ApartmentStyle  = 'Studio' | 'StandardFlat' | 'Penthouse' | 'Maisonette';
export type VerityNG_LandZoning      = 'Residential' | 'Commercial' | 'MixedUse' | 'Industrial' | 'Agricultural';
export type VerityNG_LandFeature     = 'Waterfront' | 'Reclaimed' | 'None';
export type VerityNG_BQConfig        = 'Attached' | 'Detached' | 'Rooftop';

// ───────────────────────────────────────────────────────────────────────────
// UI category (Level 1) — the 5 user-facing cards in the wizard.
// NOT a RESO field — the RESO PropertyType/PropertySubType is *derived* from
// (category + Level 2 inputs) by derivePropertySubType().
// ───────────────────────────────────────────────────────────────────────────

export type UICategory =
  | 'LandedProperty'   // Phase 1 — MVP
  | 'ResidentialHouse' // Phase 1 — MVP
  | 'ApartmentFlat'    // Phase 1 — MVP
  | 'Commercial'       // Phase 2 — disabled in UI
  | 'Farm';            // Phase 2 — disabled in UI

export type UILandSubCategory =
  | 'ResidentialPlot'
  | 'CommercialPlot'
  | 'MixedUsePlot'
  | 'IndustrialPlot'
  | 'AgriculturalPlot';

export const UI_CATEGORY_PHASE2: ReadonlySet<UICategory> = new Set<UICategory>(['Commercial', 'Farm']);

// ───────────────────────────────────────────────────────────────────────────
// RESOProperty — canonical property record (mirrors the §4 pg schema)
// ───────────────────────────────────────────────────────────────────────────

export interface RESOProperty {
  /** RESO primary key — UUID. */
  ListingKey: string;
  /** Verity VPID — `VRT-XXXXXXXXX`. */
  Verity_VPID: string;

  PropertyType: RESO_PropertyType;
  PropertySubType: RESO_PropertySubType;
  StandardStatus: RESO_StandardStatus;

  UnparsedAddress: string;
  CountyOrParish: string;       // LGA
  StateOrProvince: string;      // 'Lagos' (Phase 1 default)
  Country: 'NG';
  PostalCode?: string;
  Latitude?: number;
  Longitude?: number;

  BedroomsTotal?: number;
  BathroomsTotal?: number;
  LotSizeSquareMeters?: number;
  YearBuilt?: number;

  // Verity_NG_* — Nigeria-specific
  Verity_NG_HouseStyle?: VerityNG_HouseStyle;
  Verity_NG_HouseAttachment?: VerityNG_HouseAttachment;
  Verity_NG_ApartmentStyle?: VerityNG_ApartmentStyle;
  Verity_NG_LandZoning?: VerityNG_LandZoning;
  Verity_NG_LandFeature?: VerityNG_LandFeature;
  Verity_NG_HasBQ?: boolean;
  Verity_NG_BQConfig?: VerityNG_BQConfig;
  Verity_NG_BQSeparateTitle?: boolean;

  // Verity_* — title / verification metadata
  Verity_TitleType?: string;
  Verity_CofONumber?: string;
  Verity_RegisteredOwner?: string;
  Verity_TitleIssueDate?: string;
  Verity_TitleDuration?: string;
  Verity_SurveyPlanRef?: string;
  Verity_LGA?: string;
  Verity_ConfidenceScore?: number;
}

// ───────────────────────────────────────────────────────────────────────────
// derivePropertySubType — UI choices → RESO PropertyType + PropertySubType
//
// Per brief §5. This is the *frontend* mapping function; a server-side
// mirror will run on the API as defence in depth (tracked in the backend
// issue created during Phase 6 of the original adoption).
// ───────────────────────────────────────────────────────────────────────────

export type DeriveInput =
  | { category: 'LandedProperty';   landSubCategory: UILandSubCategory }
  | { category: 'ResidentialHouse'; houseStyle: VerityNG_HouseStyle; attachment: VerityNG_HouseAttachment }
  | { category: 'ApartmentFlat';    apartmentStyle: VerityNG_ApartmentStyle }
  | { category: 'Commercial' }
  | { category: 'Farm' };

export interface DeriveOutput {
  PropertyType: RESO_PropertyType;
  PropertySubType: RESO_PropertySubType;
  Verity_NG_LandZoning?: VerityNG_LandZoning;
}

const LAND_SUBCATEGORY_MAP: Record<
  UILandSubCategory,
  { PropertySubType: RESO_PropertySubType; Verity_NG_LandZoning: VerityNG_LandZoning }
> = {
  ResidentialPlot:  { PropertySubType: 'VacantLand',       Verity_NG_LandZoning: 'Residential'  },
  CommercialPlot:   { PropertySubType: 'CommercialLand',   Verity_NG_LandZoning: 'Commercial'   },
  MixedUsePlot:     { PropertySubType: 'VacantLand',       Verity_NG_LandZoning: 'MixedUse'     },
  IndustrialPlot:   { PropertySubType: 'CommercialLand',   Verity_NG_LandZoning: 'Industrial'   },
  AgriculturalPlot: { PropertySubType: 'AgriculturalLand', Verity_NG_LandZoning: 'Agricultural' },
};

export function derivePropertySubType(input: DeriveInput): DeriveOutput {
  switch (input.category) {
    case 'LandedProperty': {
      const m = LAND_SUBCATEGORY_MAP[input.landSubCategory];
      return { PropertyType: 'Land', PropertySubType: m.PropertySubType, Verity_NG_LandZoning: m.Verity_NG_LandZoning };
    }
    case 'ResidentialHouse': {
      // §5.2 — Nigerian "Duplex" colloquially = single-family two-storey.
      // It maps to RESO SingleFamilyResidence, NOT RESO 'Duplex' (§6.1).
      const PropertySubType: RESO_PropertySubType =
        input.houseStyle === 'Terrace' ? 'Townhouse' : 'SingleFamilyResidence';
      return { PropertyType: 'Residential', PropertySubType };
    }
    case 'ApartmentFlat': {
      // §5.3 — PropertySubType is always Apartment regardless of style.
      // ApartmentStyle (Studio/StandardFlat/Penthouse/Maisonette) is the
      // Verity_NG_* distinction.
      return { PropertyType: 'Residential', PropertySubType: 'Apartment' };
    }
    case 'Commercial':
    case 'Farm':
      throw new Error(`derivePropertySubType: '${input.category}' is a Phase 2 category`);
  }
}

// Apartment-style Nigerian colloquial tooltips (brief §5.3 — buyer-facing
// labels only; the actual Verity_NG_ApartmentStyle value is what's stored).
export const APARTMENT_STYLE_TOOLTIP: Record<VerityNG_ApartmentStyle, string> = {
  Studio:       'Self-Contain',
  StandardFlat: 'Mini-Flat (1-bed)',
  Penthouse:    '',
  Maisonette:   '',
};

// UI labels for the 5 Level-1 cards.
export const UI_CATEGORY_LABEL: Record<UICategory, string> = {
  LandedProperty:   'Landed Property',
  ResidentialHouse: 'Residential House',
  ApartmentFlat:    'Apartment / Flat',
  Commercial:       'Commercial',
  Farm:             'Farm',
};

export const UI_LAND_SUBCATEGORY_LABEL: Record<UILandSubCategory, string> = {
  ResidentialPlot:  'Residential Plot',
  CommercialPlot:   'Commercial Plot',
  MixedUsePlot:     'Mixed-Use Plot',
  IndustrialPlot:   'Industrial Plot',
  AgriculturalPlot: 'Agricultural Plot',
};
