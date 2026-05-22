import Link from 'next/link';
import type { RequestDetail } from '@/lib/types/request';
import type { BandTier, VerificationTrack } from '@/lib/types/verification';
import type { VerificationFinding, VerificationWarning } from '@/lib/services/mocks/requestService.mock';
import { BandBlock } from '@/components/verification/BandBlock';
import { StatusTrack } from '@/components/verification/StatusTrack';
import { StatusHead } from './StatusHead';

export function CompleteView({
  request,
  track,
  band,
  findings,
  warning,
}: {
  request: RequestDetail;
  track: VerificationTrack;
  band: { tier: BandTier; score: number; clarify?: string } | null;
  findings: VerificationFinding[];
  warning: VerificationWarning | null;
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
            <Link href={`/requests/${request.vpid}/share`} className="bf-btn gold" style={{ width: 'auto', minWidth: 160, textDecoration: 'none' }}>
              Share
            </Link>
          </div>

          {band && (
            <div style={{ maxWidth: 480, marginBottom: 24 }}>
              <BandBlock tier={band.tier} score={band.score} clarify={band.clarify} />
            </div>
          )}

          {findings.length > 0 && (
            <>
              <div className="bf-eyebrow slate" style={{ marginTop: 24, marginBottom: 8 }}>— What we confirmed</div>
              <ul className="bf-evi" style={{ maxWidth: 640 }}>
                {findings.map((f) => (
                  <li key={f.name} className={f.miss ? 'miss' : ''}>
                    <span className="mark">{f.miss ? '!' : '✓'}</span>
                    <div className="body">
                      <div className="h">{f.name}</div>
                      {f.ref && <div className="ref" style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', marginTop: 3 }}>{f.ref}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {warning && (
            <>
              <div className="bf-eyebrow" style={{ color: 'var(--warn)', marginTop: 28, marginBottom: 8 }}>⚑ Flag raised</div>
              <div className="bf-notice warn" style={{ maxWidth: 640 }}>
                <span className="mark">!</span>
                <div>
                  <strong style={{ color: 'var(--navy)' }}>{warning.title}</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5 }}>{warning.body}</p>
                </div>
              </div>
            </>
          )}

          <div className="bf-eyebrow slate" style={{ marginTop: 32, marginBottom: 16 }}>— Verification track</div>
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
