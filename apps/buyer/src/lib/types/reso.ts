/**
 * RESO Data Dictionary v2.0 — buyer-app type system.
 *
 * Kept in sync with `apps/developer/src/lib/types/reso.ts`. The two files
 * are intentionally identical — RESO field types are universal across
 * VERITY apps (the buyer requesting a verification and the developer
 * filing one capture the same canonical schema). A future refactor
 * could promote this to a shared `packages/reso/` workspace.
 *
 * Spec: docs/VERITY_RESO_Adoption_Brief_v1.md
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

// Compile-time guard against re-introducing forbidden subtypes (§6.1 / §6.2).
type _AssertNoDuplex      = [Extract<RESO_PropertySubType, 'Duplex'>]      extends [never] ? true : false;
type _AssertNoCondominium = [Extract<RESO_PropertySubType, 'Condominium'>] extends [never] ? true : false;
export type RESO_SubTypeIntegrity = _AssertNoDuplex & _AssertNoCondominium;
const _resoSubTypeIntegrityCheck: RESO_SubTypeIntegrity = true;
void _resoSubTypeIntegrityCheck;

export type RESO_StandardStatus =
  | 'Active' | 'ActiveUnderContract' | 'Pending' | 'Sold' | 'Expired'
  | 'Withdrawn' | 'Cancelled' | 'Incomplete';

// ───────────────────────────────────────────────────────────────────────────
// Verity_NG_*
// ───────────────────────────────────────────────────────────────────────────

export type VerityNG_HouseStyle      = 'Bungalow' | 'Duplex' | 'Terrace';
export type VerityNG_HouseAttachment = 'Detached' | 'SemiDetached';
export type VerityNG_ApartmentStyle  = 'Studio' | 'StandardFlat' | 'Penthouse' | 'Maisonette';
export type VerityNG_LandZoning      = 'Residential' | 'Commercial' | 'MixedUse' | 'Industrial' | 'Agricultural';
export type VerityNG_LandFeature     = 'Waterfront' | 'Reclaimed' | 'None';
export type VerityNG_BQConfig        = 'Attached' | 'Detached' | 'Rooftop';

// ───────────────────────────────────────────────────────────────────────────
// UI Level 1 / Level 2
// ───────────────────────────────────────────────────────────────────────────

export type UICategory =
  | 'LandedProperty' | 'ResidentialHouse' | 'ApartmentFlat'
  | 'Commercial'     | 'Farm';

export type UILandSubCategory =
  | 'ResidentialPlot' | 'CommercialPlot' | 'MixedUsePlot'
  | 'IndustrialPlot'  | 'AgriculturalPlot';

export const UI_CATEGORY_PHASE2: ReadonlySet<UICategory> = new Set<UICategory>(['Commercial', 'Farm']);

// ───────────────────────────────────────────────────────────────────────────
// derivePropertySubType — UI → RESO (mirror of developer impl)
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
      const PropertySubType: RESO_PropertySubType =
        input.houseStyle === 'Terrace' ? 'Townhouse' : 'SingleFamilyResidence';
      return { PropertyType: 'Residential', PropertySubType };
    }
    case 'ApartmentFlat':
      return { PropertyType: 'Residential', PropertySubType: 'Apartment' };
    case 'Commercial':
    case 'Farm':
      throw new Error(`derivePropertySubType: '${input.category}' is a Phase 2 category`);
  }
}

export const APARTMENT_STYLE_TOOLTIP: Record<VerityNG_ApartmentStyle, string> = {
  Studio:       'Self-Contain',
  StandardFlat: 'Mini-Flat (1-bed)',
  Penthouse:    '',
  Maisonette:   '',
};

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
