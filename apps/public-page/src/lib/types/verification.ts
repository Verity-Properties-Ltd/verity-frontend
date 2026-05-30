import type { Tier } from './certificate';

export const VERIFICATION_STAGES = [
  { name: 'Intake & receipt',        desc: 'Request received, payment confirmed' },
  { name: 'Document authenticity',   desc: 'Reference library + cross-doc consistency' },
  { name: 'Plot existence',          desc: 'Physical site visit by field specialist' },
  { name: 'Registry filing',         desc: 'Lagos State Land Registry crosscheck' },
  { name: 'Competing claims',        desc: 'VPID graph search across all records' },
  { name: 'Survey accuracy',         desc: 'Coordinates against registered survey' },
  { name: 'Specialist review',       desc: 'Licensed surveyor sign-off' },
  { name: 'Certificate issuance',    desc: 'VPR generated, public URL provisioned' },
] as const;

/** Stages that Standard tier skips (physical site visit, survey accuracy, sworn specialist sign-off). */
export const STANDARD_SKIPPED_STAGES = [2, 5, 6] as const;

export function skippedStagesForTier(tier: Tier): number[] {
  return tier === 'standard' ? [...STANDARD_SKIPPED_STAGES] : [];
}

export type BandTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'prov' | 'unconf';

export type VerificationTrack = {
  currentStage: number;
  completedDates: Record<number, string>;
  skipped: number[];
};
