import { InProgressShell } from '../../InProgressShell';

export default function DeveloperQueuePage() {
  return (
    <InProgressShell
      storyId="SUP-06"
      title="Developer Verification Queue"
      description="Manual review for developer signups where the Mono KYC check failed or returned a partial match. An account that passes Mono cleanly is auto-verified and never appears here (per PRD §5.2)."
      spec="UI/UX v1.3 §7.4 Super Admin · Accounts & Users · Cross-Role Workflow §8.6 Developer Identity Verification."
      acceptanceCriteria={[
        'Queue rows: applicant name, company, Mono failure reason, time-in-queue.',
        'Detail view shows the Mono response payload, applicant-provided info, and any contact history.',
        'Approve with reason → account verified, developer notified.',
        'Reject with reason → applicant notified with retry instructions; flow never dead-ends per §8.6.',
        'Manual KYC quota tracker (cap: 5/quarter per PRD §5.2) with visible counter.',
      ]}
    />
  );
}
