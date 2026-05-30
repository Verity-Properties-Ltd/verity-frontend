import { InProgressShell } from '../../InProgressShell';

export default function AccountsPage() {
  return (
    <InProgressShell
      storyId="SUP-01"
      title="Accounts & Users"
      description="Searchable directory of all accounts (buyers, developers) and users (account members, internal staff). Account detail with create / suspend / reactivate actions."
      spec="UI/UX v1.3 §7.4 Super Admin Workspace · Accounts & Users."
      acceptanceCriteria={[
        'Search across buyer accounts, developer accounts, internal users by name / email / VPID-of-recent-verification.',
        'Account detail: company info (developer), KYC status, team members, billing history, recent verifications, audit log of internal actions.',
        'Suspend / reactivate writes to the audit log with actor + reason.',
        'Create internal user action with role (Analyst / Operations Manager / Super Admin / Registry Liaison) — invite email sent.',
      ]}
    />
  );
}
