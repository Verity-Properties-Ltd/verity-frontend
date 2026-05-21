/* global React, Ico, VP, DvmAppBar, DvmTabletRail */
// VERITY · Developer onboarding (pre-KYC) — mobile + tablet
// 4 states: pending_kyc, kyc_in_progress, prove_session_pending, kyc_manual_review

function DvmProveModal({ vp }) {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(30,34,96,0.55)',
        backdropFilter: 'blur(2px)', zIndex: 25,
      }}></div>
      <div className="dvm-modal">
        {VP.isPhone(vp) && <div className="grabber"></div>}
        <div className="step-label">Verify identity · stage 02</div>
        <h3>Confirm your identity.</h3>
        <p className="desc">
          Capture an ID document, take a quick selfie, complete a liveness check. Mono handles capture — your BVN/NIN is never typed into Verity.
        </p>

        <div className="dvm-prove-list">
          <div className="it done">
            <span className="ic">{Ico.check}</span>
            <div className="nm">BVN entry & cross-check
              <div className="ref">last 3 digits · ••• ••• 947</div>
            </div>
            <span className="badge">Done</span>
          </div>
          <div className="it current">
            <span className="ic">2</span>
            <div className="nm">Capture ID document
              <div className="ref">NIN card · Driver's licence · Passport</div>
            </div>
            <span className="badge">Now</span>
          </div>
          <div className="it">
            <span className="ic">3</span>
            <div className="nm">Selfie & liveness</div>
            <span className="badge">Next</span>
          </div>
          <div className="it">
            <span className="ic">4</span>
            <div className="nm">Tier 2 confidence score</div>
            <span className="badge">Auto</span>
          </div>
        </div>

        <button type="button" className="dvm-btn">
          <span>Capture ID document</span> <span className="arrow">→</span>
        </button>
        <div className="mono-brand">
          <span className="mark">M</span>
          Powered by Mono Prove · Tier 2 · Encrypted
        </div>
      </div>
    </>
  );
}

function DvmOnboarding({ vp, kycState = 'pending_kyc' }) {
  const isPending = kycState === 'pending_kyc';
  const isStage1 = kycState === 'kyc_in_progress';
  const isStage2 = kycState === 'prove_session_pending';
  const isReview = kycState === 'kyc_manual_review';

  // Banner pill
  const bannerPill = isPending
    ? { cls: '', label: 'Founding 50 · Cohort 014' }
    : isStage1
      ? { cls: '', label: 'Company check · in progress' }
      : isStage2
        ? { cls: '', label: 'Identity · ready' }
        : { cls: 'review', label: 'Under review · 24h SLA' };

  // Eyebrow/title/lede
  const head = isPending
    ? { eyebrow: 'Welcome', title: 'Let\'s get <em>your company</em> verified.', lede: 'You\'re one step from your portfolio. Two short stages — company check, then a director identity capture. About six minutes total.' }
    : isStage1
      ? { eyebrow: 'Stage 01', title: 'Confirming <em>Lekki Heights</em> with CAC.', lede: 'Running in the background. We continue automatically when the check completes.' }
      : isStage2
        ? { eyebrow: 'Stage 02', title: 'Verify <em>your identity</em>.', lede: 'Company check passed. Open the Mono Prove widget below — ID capture, selfie, liveness. About three minutes.' }
        : { eyebrow: 'Under review', title: 'We\'re reviewing <em>your verification</em>.', lede: 'A Verity analyst is reviewing the auto-decisioned result. We\'ll email you within 24 hours.' };

  // Stage 1 state
  const stage1Done = isStage2 || isReview;
  const stage1Active = isStage1;

  const stage2Active = isStage2;
  const stage2Review = isReview;
  const stage2Locked = isPending || isStage1;

  const kycStepClass = isStage1 || isStage2 ? 'current' : isReview ? 'review' : 'current';

  const primaryBtn = isPending ? (
    <button type="button" className="dvm-btn">
      <span>Start company verification</span> <span className="arrow">→</span>
    </button>
  ) : isStage1 ? (
    <button type="button" className="dvm-btn outline" disabled>
      <span className="spinner" style={{
        width: 14, height: 14, border: '2px solid rgba(30,34,96,0.2)',
        borderTopColor: 'var(--navy)', borderRadius: 999,
        animation: 'dvm-spin 0.85s linear infinite', marginRight: 8,
      }}></span>
      Checking with CAC…
    </button>
  ) : isStage2 ? (
    <button type="button" className="dvm-btn gold">
      <span>Open identity verification</span> <span className="arrow">→</span>
    </button>
  ) : (
    <button type="button" className="dvm-btn outline" disabled>
      Awaiting review · ≤ 24 hours
    </button>
  );

  // ── Shell ──
  const body = (
    <div className="dvm-body pad" style={{ paddingBottom: VP.isPhone(vp) ? 100 : 32 }}>
      {/* Welcome banner */}
      <div className="dvm-onb-banner">
        <div className="row">
          <div className="label">{head.eyebrow}</div>
          <span className={`pill ${bannerPill.cls}`}>
            <span className="dot"></span>
            {bannerPill.label}
          </span>
        </div>
        <div className="h" dangerouslySetInnerHTML={{ __html: head.title }} />
        <div className="sub">{head.lede}</div>
      </div>

      {/* Checklist */}
      <div className="dvm-check">
        <div className="dvm-check-head">
          <h3>Onboarding · 4 steps</h3>
          <span className="progress">
            <em>{stage1Done ? '2' : '1'}</em> of 4 complete
          </span>
        </div>

        <div className="dvm-step done">
          <span className="marker">{Ico.check}</span>
          <div>
            <div className="h">Create your account</div>
            <div className="sub">Email verified · workspace provisioned.</div>
            <div className="meta done"><span className="dot"></span>Completed · 09 May · 14:18</div>
          </div>
        </div>

        <div className={`dvm-step ${kycStepClass}`}>
          <span className="marker">02</span>
          <div>
            <div className="h">Complete <em>company verification</em></div>
            <div className="sub">
              Automatic CAC company check, then a hosted Mono Prove session for director identity.
              We never ask you to type a BVN or NIN — the widget handles it.
            </div>

            {isPending && <div className="meta"><span className="dot"></span>Not started · ~6 minutes</div>}
            {isStage1 && <div className="meta"><span className="dot"></span>Stage 01 of 02 · running</div>}
            {isStage2 && <div className="meta"><span className="dot"></span>Stage 02 of 02 · awaiting ID capture</div>}
            {isReview && <div className="meta review"><span className="dot"></span>Manual review · 1 of 3 attempts used</div>}

            <div className="dvm-stages">
              {/* Stage 1 */}
              <div className={`dvm-stage-card ${stage1Done ? 'done' : stage1Active ? 'active' : ''}`}>
                <span className="ic">{stage1Done ? Ico.check : '01'}</span>
                <div>
                  <div className="lbl">Stage 01 · Mono Lookup · automatic</div>
                  <div className="h">Company check &amp; director cross-reference</div>
                  <div className="desc">
                    Confirms Lekki Heights with the Corporate Affairs Commission and matches Adebola Ogundimu as a registered director.
                  </div>
                  <div style={{
                    marginTop: 8,
                    fontFamily: 'var(--f-meta)', fontSize: 10,
                    color: 'var(--slate)', letterSpacing: '0.06em',
                  }}>
                    CAC RC No. · Director match · Contact match
                  </div>
                  {stage1Active && <div className="dvm-progressline"></div>}
                  <div style={{
                    marginTop: 10,
                    fontFamily: 'var(--f-meta)', fontSize: 10,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: stage1Done ? 'var(--success)' : stage1Active ? 'var(--gold-deep)' : 'var(--slate)',
                  }}>
                    {stage1Done && '✓ Completed · 09 May · 14:31'}
                    {stage1Active && '○ Running · ~18s'}
                    {!stage1Done && !stage1Active && '○ Estimated · ~30s'}
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className={`dvm-stage-card ${stage2Active ? 'active' : stage2Locked ? 'locked' : ''}`}>
                <span className="ic">{stage2Review ? '◐' : '02'}</span>
                <div>
                  <div className="lbl">Stage 02 · Mono Prove Tier 2 · in-widget</div>
                  <div className="h">
                    Personal identity verification
                    {stage2Locked && <span style={{
                      fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate-soft)',
                      letterSpacing: '0.16em', textTransform: 'uppercase', marginLeft: 8,
                    }}>· locked</span>}
                  </div>
                  <div className="desc">
                    Hosted Mono Prove session: BVN/NIN entry, ID document capture, selfie, liveness check.
                  </div>
                  <div style={{
                    marginTop: 10,
                    fontFamily: 'var(--f-meta)', fontSize: 10,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: stage2Active ? 'var(--gold-deep)' : stage2Review ? '#B07A4A' : 'var(--slate)',
                  }}>
                    {stage2Active && '○ Ready · open widget'}
                    {stage2Review && '◐ In review · ≤ 24 h'}
                    {stage2Locked && '✕ Locked · after Stage 01'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>{primaryBtn}</div>
          </div>
        </div>

        <div className="dvm-step locked">
          <span className="marker">03</span>
          <div>
            <div className="h">Add your first property</div>
            <div className="sub">Submit your first title — single entry, or CSV upload of up to 500.</div>
          </div>
        </div>

        <div className="dvm-step locked">
          <span className="marker">04</span>
          <div>
            <div className="h">Distribute certificates</div>
            <div className="sub">Sharing surface · five formats once a property reaches Provisional.</div>
          </div>
        </div>
      </div>

      {/* Side card / trust note — stacked on mobile */}
      <div className="dvm-side">
        <div className="label">How verification works</div>
        <div className="h">Two checks, <em>once.</em></div>
        <div className="body">
          Verity confirms your company and the registering director through Mono — Nigeria's identity infrastructure. Both stages combined: about six minutes. Your data stays inside Mono's secure layer.
        </div>
        <div className="partners">
          <div className="partner">
            <span className="lg">M</span>
            <div className="nm">Mono Lookup
              <div className="what">CAC company check</div>
            </div>
          </div>
          <div className="partner">
            <span className="lg">M</span>
            <div className="nm">Mono Prove
              <div className="what">Tier 2 identity capture</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dvm-trust-note">
        <div className="label">Why we verify</div>
        <div className="body">
          A verified developer issues <em>verified certificates.</em> Without it, the trust chain breaks at the first link — and your buyers lose the assurance they came for.
        </div>
      </div>
    </div>
  );

  return (
    <div className={`dvm ${vp}`}>
      {VP.isPhone(vp) ? (
        <>
          <DvmAppBar vp={vp} />
          {body}
        </>
      ) : (
        <div className="dvm-railed">
          <DvmTabletRail vp={vp} active="home" kycVerified={false} />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <DvmAppBar vp={vp} />
            {body}
          </div>
        </div>
      )}
      {/* Stage 2 takeover — Mono Prove modal */}
      {isStage2 && <DvmProveModal vp={vp} />}
    </div>
  );
}

Object.assign(window, { DvmOnboarding });
