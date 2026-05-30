import { InProgressShell } from '../../InProgressShell';

export default function OpsAssignmentPage() {
  return (
    <InProgressShell
      storyId="OPS-02 / OPS-03"
      title="Operations · Assignment & Review"
      description="Assign or reassign Submitted verifications to an analyst (load visible at the decision point). Review queue of Reports awaiting approval; approve (→ Completed) or return to analyst with comments."
      spec="UI/UX v1.3 §7.3 Operations Manager Workspace · Cross-Role Workflow §8.1 happy path."
      acceptanceCriteria={[
        'Assignment view: list of Submitted verifications, drag-or-pick to assign to an analyst.',
        'Analyst-load chip shows current count + capacity at decision time.',
        'Review queue: Reports In Review with the rendered report, signature block, and Approve / Return with comments.',
        'SLA / tier override action recorded with reason in the audit log.',
        'Action-Needed escalations land in a dedicated triage strip on this page.',
      ]}
    />
  );
}
