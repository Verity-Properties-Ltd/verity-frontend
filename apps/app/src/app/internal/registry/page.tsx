import { InProgressShell } from '../InProgressShell';

export default function RegistryLiaisonPage() {
  return (
    <InProgressShell
      storyId="ANL-09 · PRD §14.6"
      title="Registry Liaison · Premium tier"
      description="Lagos State Land Registry workspace for Premium-tier verifications requiring in-person registry visits. The liaison logs visit details, attaches registry record references, and signs off the registry-verification stage (stage 4 of the eight-stage workflow)."
      spec="PRD v2.1 §14.6 Operational Readiness · Cross-Role Workflow §8.1 stage 4."
      acceptanceCriteria={[
        'Queue of Premium verifications awaiting registry verification (sorted by SLA urgency).',
        'Per-verification visit log with date, registry staff name, file numbers pulled, scan attachments.',
        'Sign-off action attaches registry_record_id to the verification and advances stage 4 → 5.',
        'Capacity dashboard: 6-8 visits/day per liaison (PRD §14.3 throughput target).',
        'Failover path: if registry feed offline, route to Independent mode and extend SLA to 7 days per PRD §9.5.',
      ]}
    />
  );
}
