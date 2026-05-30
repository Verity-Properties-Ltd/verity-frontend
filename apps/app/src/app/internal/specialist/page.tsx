import { InProgressShell } from '../InProgressShell';

export default function SpecialistQueuePage() {
  return (
    <InProgressShell
      storyId="ANL-01"
      title="Specialist · My Queue"
      description="A prioritised list of assigned verifications, SLA-urgent first. Each row shows property address, customer type, tier, SLA countdown, and current status."
      spec="UI/UX v1.3 §7.2 Analyst Workspace — My Queue."
      acceptanceCriteria={[
        'List sorted by SLA urgency (closest-to-breach first), then Premium, then Standard by submission date.',
        'Visual escalation for breach-risk (gold tint within 24h; danger tint after breach).',
        'Counts at top: assigned, in verification, in review, action-needed.',
        'Row click opens the verification workspace at /internal/specialist/[verification_id].',
      ]}
    />
  );
}
