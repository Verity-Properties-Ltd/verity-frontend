export type KycState = 'pending_kyc' | 'stage1' | 'stage2' | 'verified';

export type StageStatus = 'locked' | 'active' | 'done';

export type KycStatus = {
  state: KycState;
  stage1Started?: string;
  stage1CompletedAt?: string;
  stage2CompletedAt?: string;
};
