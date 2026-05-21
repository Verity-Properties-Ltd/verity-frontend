import type { RequestDetail } from '@/lib/types/request';
import type { VerificationTrack } from '@/lib/types/verification';
import { StatusTrack } from '@/components/verification/StatusTrack';
import { StatusHead } from './StatusHead';

type Flag = { title: string; body: string; actionLabel?: string };

export function AwaitingView({
  request,
  track,
  flag,
}: {
  request: RequestDetail;
  track: VerificationTrack;
  flag: Flag | null;
}) {
  return (
    <div className="bf-desk-split" style={{ flex: 1 }}>
      <main className="bf-main">
        <div className="bf-main-inner">
          <StatusHead request={request} pillTier="unconf" />

          {flag && (
            <div className="bf-notice action">
              <span className="mark">⚑</span>
              <div>
                <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  {flag.title}
                </div>
                <p style={{ margin: '6px 0 0', lineHeight: 1.5, fontSize: 14, color: 'var(--cream)' }}>{flag.body}</p>
                {flag.actionLabel && (
                  <a className="bf-link" style={{ display: 'inline-block', marginTop: 12, color: 'var(--gold)', borderBottomColor: 'var(--gold)' }}>
                    {flag.actionLabel} →
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="bf-eyebrow slate" style={{ marginTop: 32, marginBottom: 16 }}>
            — Verification paused at stage {String(track.currentStage + 1).padStart(2, '0')}
          </div>
          <StatusTrack
            currentStage={track.currentStage}
            completedDates={track.completedDates}
            skipped={track.skipped}
          />
          <p className="bf-small" style={{ marginTop: 16, fontStyle: 'italic' }}>
            We&apos;ll resume immediately after you upload — typically within minutes.
          </p>
        </div>
      </main>
    </div>
  );
}
