export type CompanyProfile = {
  registeredName: string;
  rcNumber: string;
  lasreraReg: string;
  registeredAddress: string;
  primaryContact: { name: string; email: string };
};

export type TeamRole = 'Admin' | 'Editor' | 'Viewer';

export type TeamMember = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: TeamRole;
};

export type Subscription = {
  tier: string;
  cohort: string;
  used: number;
  unlimited: boolean;
  freeUntil: string;
  nextBillingDate: string;
  paymentMethod: string;
};

export type Invoice = {
  id: string;
  period: string;
  amount: string;
  note: string;
};

export type ComplianceDoc = {
  name: string;
  abbr: string;
  signedAt: string;
};

export type FoundingStatus = {
  cohort: string;
  admittedAt: string;
  cohortNumber: string;
  cohortSize: string;
  freeUntil: string;
  advisor: { name: string; email: string; phone: string };
};
