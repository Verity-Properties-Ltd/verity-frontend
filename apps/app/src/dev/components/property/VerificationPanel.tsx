import type { VerificationWorkflow } from '@dev/lib/types/property';
import { VerificationStepTracker } from './VerificationStepTracker';
import { AvmCard } from './AvmCard';
import { ChecksList } from './ChecksList';
import { ExtractedFieldsTable } from './ExtractedFieldsTable';
import { OverallResultPill, RiskRatingPill } from './RiskRatingPill';

export function VerificationPanel({ workflow }: { workflow: VerificationWorkflow }) {
  return (
    <div className="dv-verification">
      <div className="dv-verification-head">
        <div className="pills">
          <OverallResultPill result={workflow.overallResult} />
          <RiskRatingPill rating={workflow.riskRating} />
        </div>
        <div className="ana-ref">
          Lead analyst · <span className="v">{workflow.analystRef}</span>
        </div>
      </div>

      <p className="dv-verification-summary">{workflow.summary}</p>

      <VerificationStepTracker current={workflow.currentStep} estimatedCompletion={workflow.estimatedCompletion} />

      <div className="dv-verification-grid">
        <section className="dv-section">
          <h4 className="dv-section-head">Valuation</h4>
          <AvmCard value={workflow.avmValue} confidence={workflow.avmConfidence} />
        </section>

        <section className="dv-section">
          <h4 className="dv-section-head">Verification checks · five evidence workstreams</h4>
          <ChecksList checks={workflow.checks} />
        </section>

        <section className="dv-section dv-section-wide">
          <h4 className="dv-section-head">Extracted fields · AI parse</h4>
          <ExtractedFieldsTable fields={workflow.extractedFields} />
        </section>

        <section className="dv-section dv-section-wide">
          <h4 className="dv-section-head">Analyst notes</h4>
          <p className="dv-analyst-notes">{workflow.analystNotes}</p>
        </section>
      </div>
    </div>
  );
}
