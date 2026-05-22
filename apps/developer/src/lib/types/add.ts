export type PropertyKind = 'land' | 'apartment' | 'villa' | 'commercial' | 'mixed-use';

export type DocumentSlot = 'cofo' | 'survey' | 'deed' | 'consent';

export type DocumentMeta = {
  name: string;
  size: number;
  type: string;
};

export type VerificationTier = 'standard' | 'premium';

export type AddPropertyDraft = {
  step: number;
  kind: PropertyKind | null;
  address: string;
  state: string;
  lga: string;
  sizeSqm: number | null;
  documents: Partial<Record<DocumentSlot, DocumentMeta>>;
  ref: string;
  tier: VerificationTier;
};

export const EMPTY_ADD_DRAFT: AddPropertyDraft = {
  step: 0,
  kind: null,
  address: '',
  state: 'Lagos State',
  lga: '',
  sizeSqm: null,
  documents: {},
  ref: '',
  tier: 'premium',
};

export const ADD_STEPS = [
  { slug: 'type',      num: '01', label: 'Property type & address' },
  { slug: 'documents', num: '02', label: 'Title documents' },
  { slug: 'reference', num: '03', label: 'Internal reference' },
  { slug: 'tier',      num: '04', label: 'Verification tier' },
  { slug: 'review',    num: '05', label: 'Review & submit' },
] as const;

export type StepSlug = (typeof ADD_STEPS)[number]['slug'];

export const DOCUMENT_LABELS: Record<DocumentSlot, { label: string; required: boolean; note: string }> = {
  cofo:    { label: 'Certificate of Occupancy (CofO)', required: true,  note: 'Drag file or click · raises confidence' },
  survey:  { label: 'Survey plan',                     required: true,  note: 'Drag file or click · matched to LasG records' },
  deed:    { label: 'Deed of assignment',              required: true,  note: 'Required · drag file or click' },
  consent: { label: "Governor's consent",              required: false, note: 'Optional · raises band to Gold' },
};
