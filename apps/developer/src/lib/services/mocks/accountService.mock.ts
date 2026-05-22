import type { CompanyProfile, ComplianceDoc, FoundingStatus, Invoice, Subscription, TeamMember } from '@/lib/types/account';

const PROFILE: CompanyProfile = {
  registeredName: 'Lekki Heights Properties Ltd.',
  rcNumber: 'RC-1184937',
  lasreraReg: 'LSR-D-2024-00472',
  registeredAddress: '12B Admiralty Way, Lekki Phase 1, Lagos',
  primaryContact: { name: 'Adeola Ogundipe', email: 'adeola@lekkiheights.com' },
};

const TEAM: TeamMember[] = [
  { id: 'ao', initials: 'AO', name: 'Adeola Ogundipe', email: 'adeola@lekkiheights.com', role: 'Admin' },
  { id: 'ta', initials: 'TA', name: 'Tobi Adesina',    email: 'tobi@lekkiheights.com',   role: 'Editor' },
  { id: 'ke', initials: 'KE', name: 'Kemi Etomi',      email: 'kemi@lekkiheights.com',   role: 'Editor' },
  { id: 'ob', initials: 'OB', name: 'Olu Bankole',     email: 'olu@lekkiheights.com',    role: 'Viewer' },
];

const SUBSCRIPTION: Subscription = {
  tier: 'Founding 50 · Cohort 014',
  cohort: '014',
  used: 87,
  unlimited: true,
  freeUntil: '30 SEP 2027',
  nextBillingDate: '— · post-cohort billing begins 01 Oct 2027',
  paymentMethod: '**** **** **** 4192 · Mastercard · exp 09/28',
};

const INVOICES: Invoice[] = [
  { id: 'INV-2026-0512', period: 'Apr 2026', amount: '₦ 0.00', note: 'Cohort credit' },
  { id: 'INV-2026-0408', period: 'Mar 2026', amount: '₦ 0.00', note: 'Cohort credit' },
  { id: 'INV-2026-0301', period: 'Feb 2026', amount: '₦ 0.00', note: 'Cohort credit' },
];

const COMPLIANCE: ComplianceDoc[] = [
  { name: 'Data Processing Agreement', abbr: 'DPA', signedAt: 'Signed · 02 May 2026' },
  { name: 'Master Services Agreement', abbr: 'MSA', signedAt: 'Signed · 02 May 2026' },
  { name: 'Service Level Agreement',   abbr: 'SLA', signedAt: 'Signed · 02 May 2026' },
];

const FOUNDING: FoundingStatus = {
  cohort: 'Cohort 014 · admitted.',
  admittedAt: '02 MAY 2026',
  cohortNumber: '014 / 050',
  cohortSize: '12 of 50 · open',
  freeUntil: '30 SEP 2027',
  advisor: { name: 'Sheun Badmus', email: 'sheun@verity.properties', phone: '+234 · 808 · 0114' },
};

export const accountService = {
  async getProfile(): Promise<CompanyProfile> {
    await new Promise((r) => setTimeout(r, 100));
    return PROFILE;
  },
  async getSubscription(): Promise<Subscription> {
    return SUBSCRIPTION;
  },
  async listInvoices(): Promise<Invoice[]> {
    return INVOICES;
  },
  async listCompliance(): Promise<ComplianceDoc[]> {
    return COMPLIANCE;
  },
  async getFoundingStatus(): Promise<FoundingStatus> {
    return FOUNDING;
  },
};

export const teamService = {
  async list(): Promise<TeamMember[]> {
    await new Promise((r) => setTimeout(r, 100));
    return TEAM;
  },
  async invite(email: string, role: TeamMember['role']): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    console.info('[mock] teamService.invite', { email, role });
  },
};
