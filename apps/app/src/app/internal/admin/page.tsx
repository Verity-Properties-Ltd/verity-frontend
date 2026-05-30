import { InProgressShell } from '../InProgressShell';

export default function SuperAdminLanding() {
  return (
    <InProgressShell
      storyId="SUP-08"
      title="Super Admin · Home"
      description="Platform-level overview: account totals, KYC fallback queue depth, billing health, recent escalations. The Super Admin manages the platform itself, not individual verifications."
      spec="UI/UX v1.3 §7.4 Super Admin Workspace."
      acceptanceCriteria={[
        'Account totals: buyers, developers (Founding 50 + admitted), internal users.',
        'KYC fallback queue count with link to /internal/admin/developer-queue.',
        'Recent escalations strip (Action-Needed timeouts, refund requests, dispute filings).',
        'Billing snapshot: MRR placeholder, failed payments count, manual interventions in last 7 days.',
      ]}
    />
  );
}
