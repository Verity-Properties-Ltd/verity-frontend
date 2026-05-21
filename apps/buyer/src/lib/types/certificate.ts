import type { BandTier } from './verification';
import type { Tier } from './request';

export type Certificate = {
  vpid: string;
  publicUrl: string;
  property: {
    addressLine1: string;
    addressLine2: string;
    plotNo?: string;
    type: string;
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
