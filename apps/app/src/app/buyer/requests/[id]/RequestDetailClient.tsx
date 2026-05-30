'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { requestService, verificationService } from '@/lib/services';
import { AppBar } from '@/components/chrome/AppBar';
import type { RequestDetail } from '@/lib/types/request';
import type { BandTier, VerificationTrack } from '@/lib/types/verification';
import type { VerificationFinding, VerificationNote, VerificationWarning } from '@/lib/services/mocks/requestService.mock';
import { InProgressView } from './InProgressView';
import { AwaitingView } from './AwaitingView';
import { CompleteView } from './CompleteView';

type Flag = { title: string; body: string; actionLabel?: string };

export function RequestDetailClient({ vpid }: { vpid: string }) {
  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'not-found' }
    | {
        kind: 'ready';
        request: RequestDetail;
        track: VerificationTrack;
        band: { tier: BandTier; score: number; clarify?: string } | null;
        flag: Flag | null;
        note: VerificationNote | null;
        findings: VerificationFinding[];
        warning: VerificationWarning | null;
      }
  >({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [request, track, band, flag, note, findings, warning] = await Promise.all([
        requestService.get(vpid),
        verificationService.getTrack(vpid),
        verificationService.getBand(vpid),
        verificationService.getFlag(vpid),
        verificationService.getNote(vpid),
        verificationService.getFindings(vpid),
        verificationService.getWarning(vpid),
      ]);
      if (cancelled) return;
      if (!request || !track) {
        setState({ kind: 'not-found' });
        return;
      }
      setState({ kind: 'ready', request, track, band, flag, note, findings, warning });
    })();
    return () => { cancelled = true; };
  }, [vpid]);

  if (state.kind === 'loading') {
    return <div style={{ padding: 40, color: 'var(--slate)' }} className="bf-main-inner">Loading…</div>;
  }
  if (state.kind === 'not-found') {
    return (
      <div className="bf-main-inner">
        <h1 className="bf-page-h1">Request not found</h1>
        <p className="bf-small" style={{ marginTop: 12 }}>
          The reference <span className="bf-mono">{vpid}</span> isn&apos;t one we recognise.
        </p>
        <Link href="/buyer" className="bf-link" style={{ display: 'inline-block', marginTop: 16 }}>Back to dashboard →</Link>
      </div>
    );
  }

  const { request, track, band, flag, note, findings, warning } = state;
  const titleRight = (
    <span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>{vpid.toUpperCase()}</span>
  );

  return (
    <>
      <div className="wizard-mobile-chrome">
        <AppBar back title="VERITY" right={titleRight} backHref="/buyer" />
      </div>

      {request.status === 'in-progress' && (
        <InProgressView request={request} track={track} note={note} />
      )}
      {request.status === 'awaiting-action' && (
        <AwaitingView request={request} track={track} flag={flag} />
      )}
      {request.status === 'complete' && (
        <CompleteView request={request} track={track} band={band} findings={findings} warning={warning} />
      )}
    </>
  );
}
