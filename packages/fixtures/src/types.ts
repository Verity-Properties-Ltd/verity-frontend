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

export interface SeedProperty {
  type: SeedPropertyType;
  state: string;
  lga: string;
  address: string;
  plotNo?: string;
  sizeSqm?: number;
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
