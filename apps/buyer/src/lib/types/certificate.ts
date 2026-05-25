import type { BandTier } from './verification';
import type { Tier } from './request';

/**
 * Buyer-facing certificate.
 *
 * Per brief §9.4 the public verification surface returns RESO-named
 * fields only (Verity_VPID, StandardStatus, PropertyType, Verity_LGA,
 * Verity_TitleIssueDate, Verity_ConfidenceScore) — no PII like
 * Verity_RegisteredOwner or Verity_CofONumber.
 */
export type Certificate = {
  vpid: string;
  publicUrl: string;
  property: {
    addressLine1: string;
    addressLine2: string;
    plotNo?: string;
    type: string;
    sizeSqm?: number;
    // RESO fields (subset allowed on the public surface).
    PropertyType?: 'Land' | 'Residential' | 'Commercial' | 'Farm';
    PropertySubType?: string;
    StandardStatus?: string;
    Verity_LGA?: string;
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
