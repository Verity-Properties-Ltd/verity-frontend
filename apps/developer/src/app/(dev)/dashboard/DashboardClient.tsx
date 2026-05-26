'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHead } from '@/components/chrome/PageHead';
import { authService, kycService } from '@/lib/services';
import type { KycStatus } from '@/lib/types/kyc';
import { VerifiedDashboard } from './VerifiedDashboard';

type View = 'pending' | 'stage1' | 'stage2' | 'verified';

function viewFor(status: KycStatus): View {
  if (status.state === 'pending_kyc') return 'pending';
  if (status.state === 'stage1') return 'stage1';
  if (status.state === 'stage2') return 'stage2';
  return 'verified';
}

export function DashboardClient() {
  const [status, setStatus] = useState<KycStatus>({ state: 'pending_kyc' });
  const [name, setName] = useState('—');

  useEffect(() => {
    const s = authService.getSession();
    if (s) setName(s.fullName);
    setStatus(kycService.getStatus());
  }, []);

  // Stage-1 auto-advance poll
  useEffect(() => {
    if (status.state !== 'stage1') return;
    const t = setInterval(() => {
      const next = kycService.getStatus();
      setStatus(next);
      if (next.state !== 'stage1') clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [status.state]);

  function onStart() {
    setStatus(kycService.startStage1());
  }

  function onResetForDemo() {
    kycService.reset();
    setStatus({ state: 'pending_kyc' });
  }

  const view = viewFor(status);
  const firstName = name.split(' ')[0];

  // Mock-only demo footer — always rendered (matches the empty-state toggle
  // pattern in PortfolioClient) so we can reset onboarding from the verified
  // dashboard too.
  const demoFooter = (
    <div style={{ marginTop: 16, fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      Mock data only ·{' '}
      <button
        type="button"
        onClick={onResetForDemo}
        style={{ background: 'transparent', border: 0, padding: 0, color: 'var(--gold-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', borderBottom: '1px solid var(--gold)' }}
      >
        Reset KYC state
      </button>
    </div>
  );

  if (view === 'verified') {
    return (
      <>
        <VerifiedDashboard name={name} />
        {demoFooter}
      </>
    );
  }

  const head = (() => {
    if (view === 'pending') return {
      eyebrow: `Welcome · ${firstName}`,
      title: <>Let&rsquo;s get <em>your company</em> verified.</>,
      lede: 'You\u2019re one step from your portfolio. Verity verifies every developer through Mono — a CAC company check and a director identity confirmation. Both are short.',
    };
    if (view === 'stage1') return {
      eyebrow: 'Company verification · stage 01',
      title: <>Confirming <em>your company</em> with the Corporate Affairs Commission.</>,
      lede: 'This runs in the background — no action needed. We refresh status every fifteen seconds and continue automatically when the company check completes.',
    };
    if (view === 'stage2') return {
      eyebrow: 'Company verification · stage 02',
      title: <>Verify <em>your identity</em> as the registering director.</>,
      lede: 'Company check passed. Open the Mono Prove session below to capture your ID, take a selfie, and complete a brief liveness check. Three to four minutes.',
    };
    return {
      eyebrow: 'Workspace · verified',
      title: <>You&rsquo;re <em>verified</em>. Time to add your first property.</>,
      lede: 'Onboarding complete. The full dashboard — KPIs, band breakdown, distribution sparkline — ships in Phase 2.',
    };
  })();

  const action = (() => {
    if (view === 'pending') return (
      <button type="button" className="dv-btn primary" onClick={onStart}>
        Start company verification <span className="arrow">→</span>
      </button>
    );
    if (view === 'stage1') return (
      <button type="button" className="dv-btn outline" disabled>
        <span style={{ width: 10, height: 10, border: '2px solid var(--gold)', borderTopColor: 'transparent', borderRadius: 999, display: 'inline-block', animation: 'dv-spin 0.8s linear infinite' }} />
        Checking with CAC…
      </button>
    );
    return (
      <Link href="/dashboard/kyc/prove" className="dv-btn gold">
        Open identity verification <span className="arrow">→</span>
      </Link>
    );
  })();

  const pill = (() => {
    if (view === 'pending') return { label: 'Account · Founding 50 · Cohort 014' };
    if (view === 'stage1') return { label: 'Company check · in progress' };
    return { label: 'Identity verification · ready' };
  })();

  return (
    <>
      <div className="dv-onb-banner">
        <div className="seal">v</div>
        <div className="text">
          <div className="label">Phase 1 · Founding 50 · Cohort 014 · admitted 28 Apr 2026</div>
          <div className="h">
            Welcome to <em>Verity</em>, {name}.
          </div>
          <div className="sub">{authService.getSession()?.email || ''}</div>
        </div>
        <div className="pill">
          <span className="dot" />
          {pill.label}
        </div>
      </div>

      <PageHead eyebrow={head.eyebrow} title={head.title} lede={head.lede} actions={action} />

      <div className="dv-kyc-step">
        <div className="step-head">
          <span className="marker">02</span>
          <div className="body">
            <div className="h">Complete <em>company verification</em> (KYC)</div>
            <div className="sub">
              Two short stages — an automatic CAC company check, then a hosted identity capture for the registering director. We never ask you to type your BVN or NIN in Verity; the Mono Prove widget collects them privately.
            </div>
          </div>
          <div className="right">02 · current</div>
        </div>

        <div className="dv-stages">
          <div className={`dv-stage-card ${view === 'stage1' ? 'active' : view === 'stage2' ? 'done' : 'locked'}`}>
            <span className="ic">{view === 'stage2' ? '✓' : '01'}</span>
            <div className="body">
              <div className="lbl">Stage 01 · Mono Lookup · automatic</div>
              <div className="h">Company check &amp; director cross-reference</div>
              <div className="desc">
                Confirms the company is CAC-registered and that you appear on its director list. No widget — runs in the background.
              </div>
              <div className="checks">
                <span className="it">CAC status</span>
                <span className="it">RC number</span>
                <span className="it">Director list</span>
                <span className="it">Contact match</span>
              </div>
            </div>
            <div className="right">
              {view === 'stage1' ? <>Running<br />~ {Math.ceil(((kycService.msUntilStage1Done() ?? 0) / 1000))}s</> : null}
              {view === 'stage2' ? <>Completed</> : null}
              {view === 'pending' ? <>Estimated<br />~ 15s</> : null}
            </div>
            {view === 'stage1' && <div className="progress-line" />}
          </div>

          <div className={`dv-stage-card ${view === 'stage2' ? 'active' : 'locked'}`}>
            <span className="ic">02</span>
            <div className="body">
              <div className="lbl">Stage 02 · Mono Prove Tier 2 · in-widget</div>
              <div className="h">Personal identity verification</div>
              <div className="desc">
                Opens a hosted Mono Prove session: BVN/NIN entry, ID document capture, a selfie, and a brief liveness check.
              </div>
              <div className="checks">
                <span className="it">BVN / NIN</span>
                <span className="it">ID document</span>
                <span className="it">Selfie</span>
                <span className="it">Liveness</span>
                <span className="it">Consent</span>
              </div>
            </div>
            <div className="right">
              {view === 'stage2' ? <>Ready<br />open widget</> : <>Locked<br />after Stage 01</>}
            </div>
          </div>
        </div>
      </div>

      {demoFooter}
    </>
  );
}
