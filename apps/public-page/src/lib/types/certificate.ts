import type { BandTier } from './verification';

/** Verification tier — inlined here so public-page doesn't pull the entire
 *  buyer request-types module. Mirrors apps/app/src/lib/types/request.ts. */
export type Tier = 'standard' | 'premium';

/**
 * Buyer-facing certificate.
 *
 * Per Adoption Brief §9.4 and Address Capture v1 §13, the public
 * verification surface exposes ONLY the privacy-safe subset of address
 * fields: `StateOrProvince`, `City`, `CountyOrParish`,
 * `Verity_NG_Neighborhood`, `PostalCode`. Street-level data
 * (StreetNumber / StreetName / UnitNumber / Verity_NG_PlotNumber) and
 * geographic coordinates (Latitude / Longitude) are withheld.
 *
 * Other public-safe RESO fields: Verity_VPID, StandardStatus,
 * PropertyType, Verity_LGA, Verity_TitleIssueDate,
 * Verity_ConfidenceScore, BathroomsTotalDecimal. PII fields
 * (Verity_RegisteredOwner, Verity_CofONumber) are not on the surface.
 */
export type Certificate = {
  vpid: string;
  publicUrl: string;
  property: {
    // Locality — public-safe subset only
    City?: string;
    CountyOrParish?: string;
    StateOrProvince?: string;
    PostalCode?: string;
    Verity_NG_Neighborhood?: string;

    // Public-safe RESO classification
    PropertyType?: 'Land' | 'Residential' | 'Commercial' | 'Farm';
    PropertySubType?: string;
    StandardStatus?: string;
    Verity_LGA?: string;

    // Optional descriptive fields (sizeSqm safe-to-publish per §13)
    sizeSqm?: number;
  };
  verifiedAt: string;
  band: { tier: BandTier; score: number; clarify?: string };
  specialist: {
    name: string;
    title: string;
    regNo: string;
    signedAt: string;
  };
  tier: Tier;
};
