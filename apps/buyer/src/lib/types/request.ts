export type PropertyType = 'residential' | 'commercial' | 'mixed-use' | 'land';
export type Tier = 'standard' | 'premium';
export type PaymentMethod = 'card' | 'bank';

export type DocumentMeta = {
  name: string;
  size: number;
  type: string;
  ext: string;
};

export type RequestDraft = {
  property: {
    type: PropertyType | null;
    state: string;
    lga: string;
    address: string;
    plotNo?: string;
    sizeSqm?: number;
  };
  documents: DocumentMeta[];
  noDocuments: boolean;
  tier: Tier | null;
  payment: {
    method: PaymentMethod;
  };
};

export type RequestStatus = 'in-progress' | 'awaiting-action' | 'complete';

export type RequestSummary = {
  vpid: string;
  address: string;
  city: string;
  tier: Tier;
  status: RequestStatus;
  createdAt: string;
  expectedAt?: string;
};

export type RequestDetail = RequestSummary & {
  property: RequestDraft['property'];
  documents: DocumentMeta[];
};

export const TIER_PRICE: Record<Tier, number> = {
  standard: 50_000,
  premium: 150_000,
};

export const TIER_LABEL: Record<Tier, string> = {
  standard: 'Standard',
  premium: 'Premium',
};

export const EMPTY_DRAFT: RequestDraft = {
  property: { type: null, state: 'Lagos State', lga: '', address: '' },
  documents: [],
  noDocuments: false,
  tier: null,
  payment: { method: 'card' },
};
