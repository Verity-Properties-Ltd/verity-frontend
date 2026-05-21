import { EMPTY_DRAFT, type RequestDetail, type RequestDraft, type RequestStatus, type RequestSummary, type Tier } from '@/lib/types/request';
import type { BandTier, VerificationTrack } from '@/lib/types/verification';
import { skippedStagesForTier } from '@/lib/types/verification';
import type { Certificate } from '@/lib/types/certificate';

const REQUESTS_KEY = 'verity:requests';

type StoredRecord = {
  vpid: string;
  draft: RequestDraft;
  createdAt: string;
  expectedAt: string;
  status: RequestStatus;
};

type Seed = RequestSummary & {
  property: RequestDraft['property'];
  documents: RequestDraft['documents'];
  track: VerificationTrack;
  band?: { tier: BandTier; score: number; clarify?: string };
  flag?: {
    title: string;
    body: string;
    actionLabel?: string;
  };
};

const SEEDS: Seed[] = [
  {
    vpid: 'vpr-in-progress',
    address: 'Plot 27B, Admiralty Way',
    city: 'Lekki Phase 1',
    tier: 'premium',
    status: 'in-progress',
    createdAt: '2026-05-08T14:12:00.000Z',
    expectedAt: '2026-05-12T17:00:00.000Z',
    property: { type: 'residential', state: 'Lagos State', lga: 'Eti-Osa', address: 'Plot 27B, Admiralty Way, Lekki Phase 1, Lagos.', plotNo: 'LEK/PH1/27B', sizeSqm: 640 },
    documents: [
      { name: 'CofO_Lekki_Plot27B.pdf', size: 2_457_600, type: 'application/pdf', ext: 'PDF' },
      { name: 'survey_plan_signed.jpg', size: 1_153_434, type: 'image/jpeg', ext: 'JPG' },
      { name: 'deed_of_assignment.pdf', size: 3_879_731, type: 'application/pdf', ext: 'PDF' },
    ],
    track: {
      currentStage: 3,
      completedDates: { 0: '8 May · 14:12', 1: '8 May · 22:40', 2: '9 May · 10:30' },
      skipped: [],
    },
    band: { tier: 'prov', score: 0 },
  },
  {
    vpid: 'vpr-awaiting',
    address: '14 Bourdillon Rd',
    city: 'Ikoyi',
    tier: 'premium',
    status: 'awaiting-action',
    createdAt: '2026-05-08T11:00:00.000Z',
    property: { type: 'residential', state: 'Lagos State', lga: 'Ikoyi', address: '14 Bourdillon Rd, Ikoyi, Lagos.', plotNo: 'IK/BRD/14', sizeSqm: 920 },
    documents: [
      { name: 'CofO_Bourdillon.pdf', size: 2_104_320, type: 'application/pdf', ext: 'PDF' },
      { name: 'survey_plan_p2_unclear.jpg', size: 980_103, type: 'image/jpeg', ext: 'JPG' },
    ],
    track: {
      currentStage: 1,
      completedDates: { 0: '8 May · 14:12' },
      skipped: [],
    },
    flag: {
      title: 'WE NEED ONE THING',
      body: "The Survey Plan you uploaded is missing the surveyor's seal on page 2. Could you upload a clearer scan?",
      actionLabel: 'Upload replacement document',
    },
  },
  {
    vpid: 'vpr-complete',
    address: '14 Bourdillon Rd',
    city: 'Ikoyi',
    tier: 'premium',
    status: 'complete',
    createdAt: '2026-03-08T10:00:00.000Z',
    expectedAt: '2026-03-12T17:00:00.000Z',
    property: { type: 'residential', state: 'Lagos State', lga: 'Ikoyi', address: '14 Bourdillon Rd, Ikoyi, Lagos.', plotNo: 'IK/BRD/14', sizeSqm: 920 },
    documents: [
      { name: 'CofO_Bourdillon.pdf', size: 2_104_320, type: 'application/pdf', ext: 'PDF' },
      { name: 'survey_plan_signed.pdf', size: 1_823_400, type: 'application/pdf', ext: 'PDF' },
    ],
    track: {
      currentStage: 8,
      completedDates: { 0: '8 Mar · 14:12', 1: '8 Mar · 22:40', 2: '10 Mar · 09:15', 3: '10 Mar · 14:30', 4: '11 Mar · 08:45', 5: '11 Mar · 12:20', 6: '12 Mar · 09:00', 7: '12 Mar · 11:42' },
      skipped: [],
    },
    band: { tier: 'gold', score: 84, clarify: 'High confidence on documents and registry; one minor flag on plot boundary.' },
  },
  {
    vpid: 'vpr-std-complete',
    address: 'Plot 9, Banana Island',
    city: 'Foreshore Estate',
    tier: 'standard',
    status: 'complete',
    createdAt: '2026-02-01T10:00:00.000Z',
    expectedAt: '2026-02-08T17:00:00.000Z',
    property: { type: 'residential', state: 'Lagos State', lga: 'Eti-Osa', address: 'Plot 9, Banana Island, Foreshore Estate, Lagos.', sizeSqm: 1_240 },
    documents: [
      { name: 'CofO_BananaIsland.pdf', size: 3_021_900, type: 'application/pdf', ext: 'PDF' },
    ],
    track: {
      currentStage: 8,
      completedDates: { 0: '1 Feb · 09:12', 1: '2 Feb · 17:40', 3: '4 Feb · 10:30', 4: '6 Feb · 14:30', 7: '8 Feb · 11:42' },
      skipped: skippedStagesForTier('standard'),
    },
    band: { tier: 'bronze', score: 58, clarify: 'Standard tier — no site visit or survey crosscheck. Confidence capped at Silver.' },
  },
];

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
    const seeds: RequestSummary[] = SEEDS.map(({ property: _p, documents: _d, track: _t, band: _b, flag: _f, ...rest }) => rest);
    const stored = Object.values(readStored()).map(storedToSummary);
    return [...stored, ...seeds].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(vpid: string): Promise<RequestDetail | null> {
    await new Promise((r) => setTimeout(r, 120));
    const seed = SEEDS.find((s) => s.vpid === vpid);
    if (seed) {
      const { track: _t, band: _b, flag: _f, ...rest } = seed;
      return rest;
    }
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
    return seed?.band || null;
  },

  async getFlag(vpid: string): Promise<NonNullable<Seed['flag']> | null> {
    const seed = SEEDS.find((s) => s.vpid === vpid);
    return seed?.flag ?? null;
  },
};

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
    const verifiedIso = seed.track.completedDates[7]
      ? seed.expectedAt || seed.createdAt
      : seed.expectedAt || seed.createdAt;
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
