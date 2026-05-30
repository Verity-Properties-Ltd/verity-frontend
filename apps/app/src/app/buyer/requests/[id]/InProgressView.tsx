import type { RequestDetail } from '@/lib/types/request';
import type { VerificationTrack } from '@/lib/types/verification';
import type { VerificationNote } from '@/lib/services/mocks/requestService.mock';
import { StatusTrack } from '@/components/verification/StatusTrack';
import { StatusHead } from './StatusHead';

function fmtEta(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function dayOf(createdAt: string, expectedAt?: string) {
  if (!expectedAt) return { day: 1, total: 5 };
  const start = new Date(createdAt).getTime();
  const end = new Date(expectedAt).getTime();
  const now = Date.now();
  const total = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  const day = Math.min(total, Math.max(1, Math.round((now - start) / (1000 * 60 * 60 * 24))));
  return { day, total };
}

export function InProgressView({ request, track, note }: { request: RequestDetail; track: VerificationTrack; note: VerificationNote | null }) {
  const { day, total } = dayOf(request.createdAt, request.expectedAt);
  const filled = Math.min(total, Math.max(0, Math.round((day / total) * 5)));

  return (
    <div className="bf-desk-split" style={{ flex: 1 }}>
      <main className="bf-main">
        <div className="bf-main-inner">
          <StatusHead request={request} pillTier="prov" />

          <div className="bf-eta-card">
            <div className="bf-row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em' }}>EXPECTED BY</span>
              <span className="bf-h3" style={{ fontWeight: 500 }}>{fmtEta(request.expectedAt)}</span>
            </div>
            <div className="bf-row" style={{ gap: 4, marginTop: 12 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < filled ? 'var(--gold)' : 'var(--cream-deep)' }} />
              ))}
            </div>
            <div className="bf-row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
              <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em' }}>DAY {String(day).padStart(2, '0')}</span>
              <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em' }}>OF {String(total).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="bf-eyebrow slate" style={{ marginTop: 24, marginBottom: 16 }}>— Verification track</div>
          <StatusTrack
            currentStage={track.currentStage}
            completedDates={track.completedDates}
            skipped={track.skipped}
          />

          {note && (
            <>
              <div className="bf-eyebrow slate" style={{ marginTop: 32, marginBottom: 10 }}>— From the team</div>
              <div className="bf-card" style={{ padding: 14, maxWidth: 640 }}>
                <div className="bf-row" style={{ justifyContent: 'space-between' }}>
                  <span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>SPECIALIST · {note.from}</span>
                  <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>{note.at}</span>
                </div>
                <p className="bf-body" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.55 }}>{note.body}</p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
