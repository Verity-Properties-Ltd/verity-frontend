import { InProgressShell } from '../InProgressShell';

export default function OpsProductionBoardPage() {
  return (
    <InProgressShell
      storyId="OPS-01"
      title="Operations · Production Board"
      description="A live view of the entire verification pipeline. Board grouped by status with SLA health, analyst load, and throughput metrics."
      spec="UI/UX v1.3 §7.3 Operations Manager Workspace · PRD §14.3 throughput targets."
      acceptanceCriteria={[
        'Columns: Submitted → Assigned → In Verification → In Review → Action Needed → Completed.',
        'SLA health indicator per column (count at risk, count breached).',
        'Analyst load aggregated per active analyst.',
        'Filter by tier (Standard / Premium), date range, customer type.',
        'Throughput chart: verifications/day at steady state target of 8 (PRD §14.3).',
      ]}
    />
  );
}
