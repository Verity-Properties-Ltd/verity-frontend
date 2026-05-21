/* VERITY · Developer dashboard — pre-KYC onboarding states (§4.2 & §4.3)

   States supported via the `kycState` prop, mirroring the Mono KYC model:
     'pending_kyc'           — checklist surfaces; "Start company verification" CTA
     'kyc_in_progress'       — Stage 1 (Mono Lookup · company check) running automatically
     'prove_session_pending' — Stage 1 passed; Stage 2 (Mono Prove Tier 2) widget open
     'kyc_manual_review'     — borderline/repeat-failure routed to ops · 24h SLA
*/

function DevDashboardOnboarding({ kycState = 'pending_kyc' }) {
  const isPending = kycState === 'pending_kyc';
  const isStage1  = kycState === 'kyc_in_progress';
  const isStage2  = kycState === 'prove_session_pending';
  const isReview  = kycState === 'kyc_manual_review';

  // Step 02 status
  let kycStepClass = 'current';
  let kycMeta = (
    <span className="meta"><span className="dot"></span>Not started · ~6 minutes</span>
  );
  if (isStage1 || isStage2) kycStepClass = 'current';
  if (isReview) kycStepClass = 'review';

  // Stage 1 (Mono Lookup) state
  const stage1Done    = isStage2 || isReview;
  const stage1Active  = isStage1;
  // Stage 2 (Mono Prove)
  const stage2Active  = isStage2;
  const stage2Review  = isReview;
  const stage2Locked  = isPending || isStage1;

  // Banner pill copy
  const bannerPill = isPending
    ? { cls: '', label: 'Account · Founding 50 · Cohort 014' }
    : isStage1
    ? { cls: '', label: 'Company check · in progress' }
    : isStage2
    ? { cls: '', label: 'Identity verification · ready' }
    : { cls: 'review', label: 'Under review · 24-hour SLA' };

  // Page head copy
  const head = isPending
    ? {
        eyebrow: 'Welcome · Adeola',
        title: 'Let’s get <em>your company</em> verified.',
        lede: 'You’re one step from your portfolio. Verity verifies every developer through Mono — a CAC company check and a director identity confirmation. Both are short.',
      }
    : isStage1
    ? {
        eyebrow: 'Company verification · stage 01',
        title: 'Confirming <em>Lekki Heights</em> with the Corporate Affairs Commission.',
        lede: 'This runs in the background — no action needed. We refresh status every fifteen seconds and will continue automatically when the company check completes.',
      }
    : isStage2
    ? {
        eyebrow: 'Company verification · stage 02',
        title: 'Verify <em>your identity</em> as the registering director.',
        lede: 'The company check passed. Open the Mono Prove session below to capture your ID, take a selfie, and complete a brief liveness check. Three to four minutes.',
      }
    : {
        eyebrow: 'Verification under review',
        title: '<em>One of our specialists</em> is reviewing your submission.',
        lede: 'A borderline director match has routed your verification to manual review. We aim to complete reviews within twenty-four hours. The rest of the workspace remains available.',
      };

  const primaryAction = isPending ? (
    <button key="kyc-action" className="dv-btn primary">Start company verification <span className="arrow">→</span></button>
  ) : isStage1 ? (
    <button key="kyc-action" className="dv-btn outline" disabled>
      <span style={{
        width: 10, height: 10, border: '2px solid var(--gold)',
        borderTopColor: 'transparent', borderRadius: 999,
        display: 'inline-block',
        animation: 'spin 0.8s linear infinite',
      }}></span>
      Checking with CAC…
    </button>
  ) : isStage2 ? (
    <button key="kyc-action" className="dv-btn gold">Open identity verification <span className="arrow">→</span></button>
  ) : (
    <button key="kyc-action" className="dv-btn outline">Contact your advisor</button>
  );

  return (
    <div className="dv-app">
      <DevRail active="dashboard"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Onboarding']} showSearch={false}/>
        <div className="dv-content">

          {/* Welcome / status banner */}
          <div className="dv-onb-banner">
            <div className="seal">v</div>
            <div className="text">
              <div className="label">Phase 1 · Founding 50 · Cohort 014 · admitted 28 Apr 2026</div>
              <div className="h">
                Welcome to <em>Verity</em>, Lekki Heights Properties.
              </div>
              <div className="sub">
                Adeola Ogundipe · adeola@lekkiheights.ng · RC 1483920
              </div>
            </div>
            <div className={`pill ${bannerPill.cls}`}>
              <span className="dot"></span>{bannerPill.label}
            </div>
          </div>

          <PageHead
            eyebrow={head.eyebrow}
            title={head.title}
            lede={head.lede}
            actions={[primaryAction]}
          />

          {/* Two-column: checklist + side panel */}
          <div className="dv-onb-grid">
            {/* LEFT — onboarding checklist */}
            <div className="dv-checklist">
              <div className="dv-checklist-head">
                <h3>Onboarding · before you add properties</h3>
                <span className="progress">
                  <em>{stage1Done && (isStage2 || isReview) ? '2' : (isStage1 ? '1' : '1')}</em> of 4 complete
                </span>
              </div>

              {/* Step 01 — account created (always done) */}
              <div className="dv-check-step done">
                <span className="marker">✓</span>
                <div className="body">
                  <div className="h">Account created &amp; email verified</div>
                  <div className="sub">
                    Invite link opened by adeola@lekkiheights.ng on 09 May 2026 · email confirmed minutes later.
                  </div>
                  <div className="meta done">
                    <span className="dot"></span>Completed · 09 May 2026 · 14:22 WAT
                  </div>
                </div>
                <div className="right">
                  <span className="dv-mono" style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 10,
                    color: 'var(--slate)', letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}>01</span>
                </div>
              </div>

              {/* Step 02 — KYC (the focus) */}
              <div className={`dv-check-step ${kycStepClass}`}>
                <span className="marker">{isReview ? '◐' : '02'}</span>
                <div className="body">
                  <div className="h">Complete <em>company verification</em> (KYC)</div>
                  <div className="sub">
                    Two short stages — an automatic CAC company check, then a hosted identity capture for the registering director. We never ask you to type your BVN or NIN in Verity; the Mono Prove widget collects them privately.
                  </div>

                  {/* Status meta line */}
                  {isPending && (
                    <div className="meta">
                      <span className="dot"></span>Not started · estimated 6 minutes
                    </div>
                  )}
                  {isStage1 && (
                    <div className="meta">
                      <span className="dot"></span>Stage 01 of 02 · running automatically
                    </div>
                  )}
                  {isStage2 && (
                    <div className="meta">
                      <span className="dot"></span>Stage 02 of 02 · awaiting your identity capture
                    </div>
                  )}
                  {isReview && (
                    <div className="meta review">
                      <span className="dot"></span>Under manual review · 24-hour SLA · 1 of 3 attempts used
                    </div>
                  )}

                  {/* Stage cards always shown under the current step */}
                  <div className="dv-stages">
                    {/* STAGE 1 — Mono Lookup */}
                    <div className={`dv-stage-card ${stage1Done ? 'done' : stage1Active ? 'active' : ''}`}>
                      <span className="ic">{stage1Done ? '✓' : '01'}</span>
                      <div className="body">
                        <div className="lbl">Stage 01 · Mono Lookup · automatic</div>
                        <div className="h">Company check &amp; director cross-reference</div>
                        <div className="desc">
                          We confirm the company is active and CAC-registered, and that the registering contact appears in the company’s director list. No widget — runs in the background.
                        </div>
                        <div className="checks">
                          <span className="it">CAC status</span>
                          <span className="it">RC number</span>
                          <span className="it">Director list</span>
                          <span className="it">Contact match</span>
                        </div>
                        {stage1Active && <div className="progress-line"></div>}
                      </div>
                      <div className="right">
                        {stage1Done && <>Completed<br/>09 May · 14:31</>}
                        {stage1Active && <>Running<br/>~ 18s</>}
                        {!stage1Done && !stage1Active && <>Estimated<br/>~ 30s</>}
                      </div>
                    </div>

                    {/* STAGE 2 — Mono Prove Tier 2 */}
                    <div className={`dv-stage-card ${stage2Active ? 'active' : stage2Review ? '' : stage2Locked ? 'locked' : ''}`}>
                      <span className="ic">{stage2Active ? '02' : stage2Review ? '◐' : '02'}</span>
                      <div className="body">
                        <div className="lbl">Stage 02 · Mono Prove Tier 2 · in-widget</div>
                        <div className="h">
                          Personal identity verification {stage2Locked && <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate-soft)', letterSpacing:'0.16em', textTransform:'uppercase', marginLeft:6}}>· locked</span>}
                        </div>
                        <div className="desc">
                          Opens a hosted Mono Prove session: BVN or NIN entry, capture of a physical ID document, a selfie, and a brief liveness check. We display BVN/NIN masked to the last three digits (e.g. <span style={{fontFamily:'DM Mono, monospace'}}>***901</span>) — never in full.
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
                        {stage2Active && <>Ready<br/>open widget</>}
                        {stage2Review && <>In review<br/>≤ 24 h</>}
                        {stage2Locked && <>Locked<br/>after Stage 01</>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <span style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 10,
                    color: 'var(--gold-deep)', letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}>02 · current</span>
                </div>
              </div>

              {/* Step 03 — add first property (gated/locked) */}
              <div className="dv-check-step locked">
                <span className="marker">🔒</span>
                <div className="body">
                  <div className="h">Add your first property</div>
                  <div className="sub">
                    Unlocks once company verification is complete. Founding 50 partners can bulk-import existing inventories from a CSV.
                  </div>
                  <div className="meta">
                    <span className="dot" style={{background:'var(--slate-soft)'}}></span>Locked · complete KYC to unlock
                  </div>
                </div>
                <div className="right">
                  <span style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 10,
                    color: 'var(--slate-soft)', letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}>03</span>
                </div>
              </div>

              {/* Step 04 — first certificates issued (locked) */}
              <div className="dv-check-step locked">
                <span className="marker">○</span>
                <div className="body">
                  <div className="h">First certificates issued</div>
                  <div className="sub">
                    2–4 weeks after portfolio submission, depending on size and complexity. We’ll notify Adeola when the first VPID goes live.
                  </div>
                  <div className="meta">
                    <span className="dot" style={{background:'var(--slate-soft)'}}></span>Pending portfolio
                  </div>
                </div>
                <div className="right">
                  <span style={{
                    fontFamily: 'DM Mono, monospace', fontSize: 10,
                    color: 'var(--slate-soft)', letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}>04</span>
                </div>
              </div>
            </div>

            {/* RIGHT — explainer + trust note */}
            <div className="dv-onb-side">
              <div className="dv-side-card">
                <div className="label">How verification works</div>
                <h2 className="h">
                  Two stages. <em>Two products.</em><br/>Both from Mono.
                </h2>
                <p className="body">
                  Verifying a developer has two distinct needs — confirming the business is real and CAC-registered, and confirming the registering person genuinely owns the identity they claim. Each is powered by a purpose-built Mono product.
                </p>
                <div className="partners">
                  <div className="partner">
                    <span className="lg">MONO · LOOKUP</span>
                    <div className="nm">
                      Company check
                      <div className="what">CAC + director cross-check</div>
                    </div>
                    <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold)', letterSpacing:'0.18em'}}>STAGE 01</span>
                  </div>
                  <div className="partner">
                    <span className="lg">MONO · PROVE T2</span>
                    <div className="nm">
                      Identity verification
                      <div className="what">ID · selfie · liveness</div>
                    </div>
                    <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold)', letterSpacing:'0.18em'}}>STAGE 02</span>
                  </div>
                </div>
              </div>

              <div className="dv-trust-note">
                <div className="label">Privacy & data handling</div>
                <div className="body">
                  Your BVN and NIN are <em>never displayed in full</em> anywhere in Verity. Identity capture runs inside the Mono widget, not on our servers. Failed facial matches route to manual review — not a hard fail.
                </div>
              </div>
            </div>
          </div>

          {/* Locked placeholder strip — KPIs greyed out */}
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <div className="dv-locked">
              <div className="dv-kpi-grid">
                <div className="dv-kpi">
                  <div className="label">Portfolio · total</div>
                  <div className="value">—</div>
                  <div className="delta">Add your first property</div>
                </div>
                <div className="dv-kpi">
                  <div className="label">In verification</div>
                  <div className="value">—</div>
                  <div className="delta">Awaits portfolio</div>
                </div>
                <div className="dv-kpi">
                  <div className="label">Expiring · 90 days</div>
                  <div className="value">—</div>
                  <div className="delta">Awaits portfolio</div>
                </div>
                <div className="dv-kpi">
                  <div className="label">Distribution · MTD</div>
                  <div className="value">—</div>
                  <div className="delta">Awaits portfolio</div>
                </div>
              </div>
            </div>
            <span className="dv-locked-label">
              <span className="ic">⊕</span>Portfolio unlocks after company verification
            </span>
          </div>

          {/* Activity feed + quick action — sober pre-portfolio state */}
          <div className="dv-blocks">
            <div className="dv-block">
              <div className="dv-block-head">
                <h3>Onboarding activity</h3>
                <span className="meta">Since invite · 09 May</span>
              </div>
              <div className="dv-feed">
                {isReview && (
                  <div className="dv-feed-item">
                    <span className="when">09 May · 14:36</span>
                    <span className="what">
                      Verification routed to <em>manual review</em> — borderline director match
                    </span>
                    <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'#B07A4A', letterSpacing:'0.14em'}}>· REVIEW</span>
                  </div>
                )}
                {(isStage2 || isReview) && (
                  <div className="dv-feed-item">
                    <span className="when">09 May · 14:33</span>
                    <span className="what">
                      Stage 01 · <em>Mono Lookup</em> passed — RC 1483920 confirmed with CAC
                    </span>
                    <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'#3D7A3D', letterSpacing:'0.14em'}}>✓ PASS</span>
                  </div>
                )}
                {(isStage1 || isStage2 || isReview) && (
                  <div className="dv-feed-item">
                    <span className="when">09 May · 14:31</span>
                    <span className="what">
                      Company verification <em>started</em> — Stage 01 dispatched to Mono Lookup
                    </span>
                    <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--gold-deep)', letterSpacing:'0.14em'}}>· KYC</span>
                  </div>
                )}
                <div className="dv-feed-item">
                  <span className="when">09 May · 14:22</span>
                  <span className="what">
                    Email verified · <em>adeola@lekkiheights.ng</em>
                  </span>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'#3D7A3D', letterSpacing:'0.14em'}}>✓ ACCOUNT</span>
                </div>
                <div className="dv-feed-item">
                  <span className="when">09 May · 14:18</span>
                  <span className="what">
                    Invite link opened · <em>Founding 50 · Cohort 014</em>
                  </span>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.14em'}}>· INVITE</span>
                </div>
                <div className="dv-feed-item">
                  <span className="when">28 Apr · 11:05</span>
                  <span className="what">
                    Application <em>approved</em> by Sheun Badmus — admitted to Founding 50
                  </span>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'#3D7A3D', letterSpacing:'0.14em'}}>✓ ADMITTED</span>
                </div>
              </div>
            </div>

            <div className="dv-block">
              <div className="dv-block-head">
                <h3>Your advisor at Verity</h3>
                <span className="meta">Reach out anytime</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0 16px' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 999,
                  background: 'var(--navy)', color: 'var(--cream)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 500,
                }}>SB</div>
                <div>
                  <div style={{ fontSize: 15, color: 'var(--navy)', fontWeight: 500 }}>Sheun Badmus</div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 3 }}>
                    Co-founder · Partnerships
                  </div>
                </div>
              </div>
              <div style={{
                borderTop: '1px solid var(--line)', paddingTop: 14,
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
                fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--slate)', letterSpacing: '0.10em',
              }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--slate-soft)', textTransform: 'uppercase', marginBottom: 4 }}>Email</div>
                  <div style={{ color: 'var(--navy)' }}>sheun@verity.properties</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--slate-soft)', textTransform: 'uppercase', marginBottom: 4 }}>WhatsApp</div>
                  <div style={{ color: 'var(--navy)' }}>+234 803 014 0142</div>
                </div>
              </div>
              <div style={{
                marginTop: 18, padding: '12px 14px',
                background: 'var(--cream-shade)', border: '1px solid var(--line)',
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 14, color: 'var(--slate)', lineHeight: 1.5,
              }}>
                If anything in the KYC flow feels unclear or your verification stalls beyond 24 hours, reach out directly. We treat Founding 50 onboarding as concierge.
              </div>
            </div>
          </div>

          {/* Footer micro-meta */}
          <div style={{
            marginTop: 24, paddingTop: 14,
            borderTop: '1px solid var(--line)',
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'DM Mono, monospace', fontSize: 9,
            color: 'var(--slate-soft)', letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>
            <span>VERITY · Phase 1 · §4.3 Dashboard · pre-KYC state</span>
            <span>Polling every 15 s while KYC in progress</span>
          </div>

        </div>

        {/* Mono Prove widget — only when Stage 2 active */}
        {isStage2 && <MonoProveModal/>}

        {/* spin keyframe */}
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </main>
    </div>
  );
}

/* ─── Mono Prove modal — Stage 2 widget mock ──────────────── */
function MonoProveModal() {
  return (
    <div className="dv-modal-backdrop">
      <div className="dv-prove">
        <div className="dv-prove-head">
          <div className="brand">
            <span className="mark">m</span>
            MONO PROVE · TIER 2
          </div>
          <div className="secure">SECURE SESSION</div>
        </div>

        <div className="dv-prove-body">
          <div className="step-label">Step 02 of 05 · Identity verification</div>
          <h3>Capture your <em style={{fontStyle:'italic', color:'var(--gold-deep)'}}>physical ID document</em></h3>
          <div className="desc">
            Hold your National ID, Driver’s Licence, or International Passport flat in good light. We’ll auto-detect when the photo is clear enough.
          </div>

          <div className="dv-prove-list">
            <div className="it done">
              <span className="ic">✓</span>
              <div className="nm">
                BVN / NIN entered
                <div className="ref">Masked · ending ***901</div>
              </div>
              <span className="badge">Completed</span>
            </div>
            <div className="it current">
              <span className="ic">▣</span>
              <div className="nm">
                ID document capture
                <div className="ref">National ID · live preview</div>
              </div>
              <span className="badge">In progress</span>
            </div>
            <div className="it">
              <span className="ic">○</span>
              <div className="nm">Selfie capture</div>
              <span className="badge">Next</span>
            </div>
            <div className="it">
              <span className="ic">○</span>
              <div className="nm">Liveness check</div>
              <span className="badge">Next</span>
            </div>
            <div className="it">
              <span className="ic">○</span>
              <div className="nm">Consent &amp; submit</div>
              <span className="badge">Next</span>
            </div>
          </div>
        </div>

        <div className="dv-prove-foot">
          <div className="meta">
            Hosted by <em>Mono</em> · NDPR-compliant · Session expires in 14:32
          </div>
          <button className="dv-btn primary sm">Capture document →</button>
        </div>
      </div>
    </div>
  );
}

window.DevDashboardOnboarding = DevDashboardOnboarding;
window.MonoProveModal = MonoProveModal;
