import { InProgressShell } from '../../InProgressShell';

export default async function VerificationWorkspacePage({
  params,
}: {
  params: Promise<{ verification_id: string }>;
}) {
  const { verification_id } = await params;
  return (
    <InProgressShell
      storyId="ANL-02"
      title={`Verification Workspace · ${verification_id}`}
      description="One screen to run the review and produce the Verification Report: property panel, five evidence workstreams, request-more-information action, draft autosave, risk-rating tool, submit-for-review action."
      spec="UI/UX v1.3 §7.2 Analyst Workspace · PRD v2.1 §5.5 Module: Analyst Console · §14.3 Eight-stage verification workflow."
      acceptanceCriteria={[
        'Property panel renders all submitted details and documents inline.',
        'Five evidence workstreams (title, ownership, encumbrance, survey, risk) as structured forms with status (clear / flagged / unresolved), findings text, evidence attachments.',
        'Draft autosave per workstream; resume-on-reload.',
        'Risk-rating tool assembles the overall confidence band per PRD §4.4 algorithm; dual sign-off required for any analyst override.',
        '"Submit for review" hands the Report to Operations (status → In Review).',
        '"Request more information" pauses the SLA clock and notifies the customer via WhatsApp + email.',
      ]}
    />
  );
}
