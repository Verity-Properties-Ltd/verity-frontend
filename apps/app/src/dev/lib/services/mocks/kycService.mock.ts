import type { KycState, KycStatus } from '@dev/lib/types/kyc';

const KEY = 'verity:dev-kyc';
const STAGE1_DURATION_MS = 15_000;

function readStatus(): KycStatus {
  if (typeof window === 'undefined') return { state: 'pending_kyc' };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { state: 'pending_kyc' };
    const parsed = JSON.parse(raw) as KycStatus;
    return parsed;
  } catch {
    return { state: 'pending_kyc' };
  }
}

function writeStatus(status: KycStatus) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(KEY, JSON.stringify(status));
  }
}

/** Computes the effective KYC state, advancing stage1 → stage2 if 15s have elapsed. */
function effectiveStatus(stored: KycStatus): KycStatus {
  if (stored.state !== 'stage1' || !stored.stage1Started) return stored;
  const startedAt = new Date(stored.stage1Started).getTime();
  if (Date.now() - startedAt >= STAGE1_DURATION_MS) {
    const next: KycStatus = {
      state: 'stage2',
      stage1Started: stored.stage1Started,
      stage1CompletedAt: new Date(startedAt + STAGE1_DURATION_MS).toISOString(),
    };
    writeStatus(next);
    return next;
  }
  return stored;
}

export const kycService = {
  getStatus(): KycStatus {
    return effectiveStatus(readStatus());
  },

  /** Begin Stage 1 (Mono Lookup). State auto-advances to stage2 ~15s later. */
  startStage1(): KycStatus {
    const status: KycStatus = {
      state: 'stage1',
      stage1Started: new Date().toISOString(),
    };
    writeStatus(status);
    return status;
  },

  /** Open a Mono Prove session (mock returns a fake sessionId). */
  async openProveSession(): Promise<{ sessionId: string }> {
    await new Promise((r) => setTimeout(r, 200));
    return { sessionId: `prove_${Math.random().toString(36).slice(2, 10)}` };
  },

  /** Called when the Prove widget completes — transitions to verified. */
  completeStage2(): KycStatus {
    const current = readStatus();
    const status: KycStatus = {
      state: 'verified',
      stage1Started: current.stage1Started,
      stage1CompletedAt: current.stage1CompletedAt,
      stage2CompletedAt: new Date().toISOString(),
    };
    writeStatus(status);
    return status;
  },

  reset(): void {
    if (typeof window !== 'undefined') window.localStorage.removeItem(KEY);
  },

  /** Hook for components to poll Stage 1 progress without a Subscription primitive. */
  msUntilStage1Done(): number | null {
    const stored = readStatus();
    if (stored.state !== 'stage1' || !stored.stage1Started) return null;
    const startedAt = new Date(stored.stage1Started).getTime();
    return Math.max(0, STAGE1_DURATION_MS - (Date.now() - startedAt));
  },
};

export type { KycState };
