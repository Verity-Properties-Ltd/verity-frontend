import Link from 'next/link';
import type { RequestDetail } from '@/lib/types/request';
import type { BandTier, VerificationTrack } from '@/lib/types/verification';
import { BandBlock } from '@/components/verification/BandBlock';
import { StatusTrack } from '@/components/verification/StatusTrack';
import { StatusHead } from './StatusHead';

export function CompleteView({
  request,
  track,
  band,
}: {
  request: RequestDetail;
  track: VerificationTrack;
  band: { tier: BandTier; score: number; clarify?: string } | null;
}) {
  return (
    <div className="bf-desk-split" style={{ flex: 1 }}>
      <main className="bf-main">
        <div className="bf-main-inner">
          <StatusHead request={request} pillTier={band?.tier || 'gold'} />

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href={`/requests/${request.vpid}/certificate`} className="bf-btn primary" style={{ width: 'auto', minWidth: 200, textDecoration: 'none' }}>
              View certificate <span className="arrow">→</span>
            </Link>
            <button type="button" className="bf-btn outline" style={{ width: 'auto', minWidth: 140 }}>
              Download PDF
            </button>
          </div>

          {band && (
            <div style={{ maxWidth: 480, marginBottom: 24 }}>
              <BandBlock tier={band.tier} score={band.score} clarify={band.clarify} />
            </div>
          )}

          <div className="bf-eyebrow slate" style={{ marginTop: 24, marginBottom: 16 }}>— Verification track</div>
          <StatusTrack
            currentStage={track.currentStage}
            completedDates={track.completedDates}
            skipped={track.skipped}
          />
        </div>
      </main>
    </div>
  );
}
