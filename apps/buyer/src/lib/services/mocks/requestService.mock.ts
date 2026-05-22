import { EMPTY_DRAFT, type RequestDetail, type RequestDraft, type RequestStatus, type RequestSummary, type Tier } from '@/lib/types/request';
import type { BandTier, VerificationTrack } from '@/lib/types/verification';
import { skippedStagesForTier } from '@/lib/types/verification';
import type { Certificate } from '@/lib/types/certificate';
import { VERIFICATION_SEEDS, type VerificationSeed } from '@verity/fixtures';

const REQUESTS_KEY = 'verity:requests';

type StoredRecord = {
  vpid: string;
  draft: RequestDraft;
  createdAt: string;
  expectedAt: string;
  status: RequestStatus;
};

type Finding = NonNullable<VerificationSeed['findings']>[number];
type Note = NonNullable<VerificationSeed['note']>;
type Warning = NonNullable<VerificationSeed['warning']>;

const SEEDS = VERIFICATION_SEEDS;

function seedToSummary(s: VerificationSeed): RequestSummary {
  return {
    vpid: s.vpid,
    address: s.address,
    city: s.city,
    tier: s.tier,
    status: s.status,
    createdAt: s.createdAt,
    expectedAt: s.expectedAt,
  };
}

function seedToDetail(s: VerificationSeed): RequestDetail {
  return {
    ...seedToSummary(s),
    property: s.property,
    documents: s.documents,
  };
}

function readStored(): Record<string, StoredRecord> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(REQUESTS_KEY) || '{}');
  } catch {
    return {};
  }
}

function storedToSummary(r: StoredRecord): RequestSummary {
  const firstLine = r.draft.property.address?.split(',')[0]?.trim() || 'Untitled property';
  const cityPart = r.draft.property.address?.split(',').slice(1, 2).join('').trim() || r.draft.property.lga || '';
  return {
    vpid: r.vpid,
    address: firstLine,
    city: cityPart,
    tier: (r.draft.tier as Tier) || 'premium',
    status: r.status,
    createdAt: r.createdAt,
    expectedAt: r.expectedAt,
  };
}

function storedToDetail(r: StoredRecord): RequestDetail {
  return {
    ...storedToSummary(r),
    property: r.draft.property,
    documents: r.draft.documents,
  };
}

function fakeVpid() {
  const n = String(Math.floor(100_000 + Math.random() * 900_000)).slice(0, 6);
  return `VPR-2026-${n}`;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export const requestService = {
  createDraft(): RequestDraft {
    return structuredClone(EMPTY_DRAFT);
  },

  async submit(draft: RequestDraft): Promise<{ vpid: string; expectedAt: string }> {
    await new Promise((r) => setTimeout(r, 600));
    const vpid = fakeVpid();
    const days = draft.tier === 'standard' ? 7 : 5;
    const expected = new Date();
    expected.setDate(expected.getDate() + days);
    if (typeof window !== 'undefined') {
      const records = readStored();
      records[vpid] = {
        vpid,
        draft,
        createdAt: new Date().toISOString(),
        expectedAt: expected.toISOString(),
        status: 'in-progress',
      };
      window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(records));
    }
    console.info('[mock] submit', { vpid, files: draft.documents.map((d) => d.name) });
    return { vpid, expectedAt: fmtDate(expected) };
  },

  async list(): Promise<RequestSummary[]> {
    await new Promise((r) => setTimeout(r, 120));
    const seeds = SEEDS.map(seedToSummary);
    const stored = Object.values(readStored()).map(storedToSummary);
    return [...stored, ...seeds].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(vpid: string): Promise<RequestDetail | null> {
    await new Promise((r) => setTimeout(r, 120));
    const seed = SEEDS.find((s) => s.vpid === vpid);
    if (seed) return seedToDetail(seed);
    const stored = readStored()[vpid];
    return stored ? storedToDetail(stored) : null;
  },
};

export const verificationService = {
  async getTrack(vpid: string): Promise<VerificationTrack | null> {
    await new Promise((r) => setTimeout(r, 80));
    const seed = SEEDS.find((s) => s.vpid === vpid);
    if (seed) return seed.track;
    const stored = readStored()[vpid];
    if (!stored) return null;
    return {
      currentStage: stored.status === 'complete' ? 8 : 0,
      completedDates: {},
      skipped: skippedStagesForTier((stored.draft.tier as Tier) || 'premium'),
    };
  },

  async getBand(vpid: string): Promise<{ tier: BandTier; score: number; clarify?: string } | null> {
    const seed = SEEDS.find((s) => s.vpid === vpid);
    return seed?.band ?? null;
  },

  async getFlag(vpid: string): Promise<NonNullable<VerificationSeed['flag']> | null> {
    const seed = SEEDS.find((s) => s.vpid === vpid);
    return seed?.flag ?? null;
  },

  async getNote(vpid: string): Promise<Note | null> {
    const seed = SEEDS.find((s) => s.vpid === vpid);
    return seed?.note ?? null;
  },

  async getFindings(vpid: string): Promise<Finding[]> {
    const seed = SEEDS.find((s) => s.vpid === vpid);
    return seed?.findings ?? [];
  },

  async getWarning(vpid: string): Promise<Warning | null> {
    const seed = SEEDS.find((s) => s.vpid === vpid);
    return seed?.warning ?? null;
  },
};

export type VerificationNote = Note;
export type VerificationFinding = Finding;
export type VerificationWarning = Warning;

function fmtVerifiedDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

function propertyTypeLabel(t: RequestDraft['property']['type'], sizeSqm?: number) {
  const type = t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Property';
  return sizeSqm ? `${type} · ${sizeSqm} sqm` : type;
}

export const certificateService = {
  async get(vpid: string): Promise<Certificate | null> {
    await new Promise((r) => setTimeout(r, 120));
    const seed = SEEDS.find((s) => s.vpid === vpid);
    if (!seed || seed.status !== 'complete' || !seed.band) return null;
    const [addr1, ...rest] = seed.property.address.split(',');
    const verifiedIso = seed.expectedAt || seed.createdAt;
    return {
      vpid,
      publicUrl: `verity.properties/v/${vpid.toUpperCase()}`,
      property: {
        addressLine1: addr1.trim(),
        addressLine2: rest.join(',').trim() || seed.city,
        plotNo: seed.property.plotNo,
        type: propertyTypeLabel(seed.property.type, seed.property.sizeSqm),
        sizeSqm: seed.property.sizeSqm,
      },
      verifiedAt: fmtVerifiedDate(verifiedIso),
      band: seed.band,
      specialist: {
        name: seed.tier === 'standard' ? 'Verity Document Desk' : 'Ifeoma Okafor',
        title: seed.tier === 'standard' ? 'Document & Registry Specialist' : 'Licensed Estate Surveyor & Valuer',
        regNo: seed.tier === 'standard' ? 'VERITY DESK · 0042' : 'NIESV REG. NO. 4892',
        signedAt: fmtVerifiedDate(verifiedIso),
      },
      tier: seed.tier,
    };
  },
};

export const shareService = {
  async copyLink(vpid: string): Promise<{ url: string }> {
    const url = `https://verity.properties/v/${vpid.toUpperCase()}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
    }
    return { url };
  },

  async email(vpid: string, recipient: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 500));
    console.info('[mock] shareService.email', { vpid, recipient });
  },

  whatsappUrl(vpid: string): string {
    const link = `https://verity.properties/v/${vpid.toUpperCase()}`;
    const msg = `Verity property verification: ${link}`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  },
};
