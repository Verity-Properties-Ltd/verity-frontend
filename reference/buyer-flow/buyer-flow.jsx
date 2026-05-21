/* global React, ReactDOM, IOSDevice, ChromeWindow */
// VERITY buyer flow — consolidated single-file build.
// All 16 screens × 3 viewports (phone / tablet / desktop). Each screen takes
// a `viewport` prop; layout adapts per size. Tablet renders in both portrait
// and landscape iPad-style frames; desktop renders in browser chrome with a
// left nav rail.

// ════════════════════════════════════════════════════════════════════
// 1 · ATOMS — brand, chrome, badges, tracks
// ════════════════════════════════════════════════════════════════════

function VerityMark({ size = 22 }) {
  const w = size, h = Math.round(size * 50 / 44);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 50" width={w} height={h}>
      <path d="M 4 0 L 40 0 Q 44 0 44 4 L 44 34 Q 44 37 41.5 38.5 L 24.5 48.3 Q 22 49.7 19.5 48.3 L 2.5 38.5 Q 0 37 0 34 L 0 4 Q 0 0 4 0 Z" fill="#1E2260" />
      <path d="M 30 7 L 37 7 L 37 14" stroke="#C9A961" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Brand({ meta }) {
  return (
    <div className="bf-brand">
      <div className="mark"><VerityMark size={20} /><span className="word">VERITY</span></div>
      {meta && <span className="meta">{meta}</span>}
    </div>
  );
}

function AppBar({ back = true, title, right }) {
  return (
    <div className="bf-appbar">
      <div className="left">
        {back && (
          <span className="bf-icon" aria-hidden style={{ marginLeft: -4 }}>
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path d="M7.5 1L1.5 7l6 6" stroke="#1E2260" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
        <span className="word">{title || 'VERITY'}</span>
      </div>
      <div className="right">{right}</div>
    </div>
  );
}

function BuyerTabs({ active = 'dashboard' }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'new', label: 'New request' },
    { id: 'history', label: 'History' },
    { id: 'account', label: 'Account' },
  ];
  return (
    <div className="bf-tabs">
      {tabs.map(t => (<span key={t.id} className={`bf-tab ${active === t.id ? 'active' : ''}`}>{t.label}</span>))}
    </div>
  );
}

function StepBar({ steps, current }) {
  return (
    <div className="bf-steps">
      {steps.map((s, i) => {
        const cls = i < current ? 'done' : i === current ? 'current' : '';
        return <div key={s} className={`seg ${cls}`} />;
      })}
    </div>
  );
}

function BandPill({ tier = 'gold', score }) {
  const NAMES = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze', prov: 'Provisional', unconf: 'Unconfirmed' };
  return (
    <span className={`bf-band ${tier}`}>
      <span className="dot" />
      <span>{NAMES[tier]}{score != null ? ` · ${score}` : ''}</span>
    </span>
  );
}

function BandBlock({ tier = 'gold', score = 82, clarify }) {
  const TIERS = ['platinum', 'gold', 'silver', 'bronze', 'prov', 'unconf'];
  const LABELS = ['PLAT', 'GOLD', 'SILV', 'BRNZ', 'PROV', 'UNCF'];
  const idx = TIERS.indexOf(tier);
  const NAMES = { platinum: 'Platinum confidence', gold: 'Gold confidence', silver: 'Silver confidence', bronze: 'Bronze confidence', prov: 'Provisional', unconf: 'Unconfirmed' };
  return (
    <div className="bf-band-block">
      <div className="band-name">— {NAMES[tier]} —</div>
      <div className="score-row"><span className="score">{score}</span><span className="score-of">of 100</span></div>
      <div className="stratum-row">{TIERS.map((t, i) => <div key={t} className={`stratum ${i <= idx ? 'fill' : ''}`} />)}</div>
      <div className="label-row">{LABELS.map((l, i) => <div key={l} className={i === idx ? 'active' : ''}>{l}</div>)}</div>
      {clarify && <div className="band-clarify">{clarify}</div>}
    </div>
  );
}

const VERIFICATION_STAGES = [
  { name: 'Intake & receipt',        desc: 'Request received, payment confirmed' },
  { name: 'Document authenticity',   desc: 'Reference library + cross-doc consistency' },
  { name: 'Plot existence',          desc: 'Physical site visit by field specialist' },
  { name: 'Registry filing',         desc: 'Lagos State Land Registry crosscheck' },
  { name: 'Competing claims',        desc: 'VPID graph search across all records' },
  { name: 'Survey accuracy',         desc: 'Coordinates against registered survey' },
  { name: 'Specialist review',       desc: 'Licensed surveyor sign-off' },
  { name: 'Certificate issuance',    desc: 'VPR generated, public URL provisioned' },
];

function StatusTrack({ currentStage = 3, completedDates = {}, dense }) {
  return (
    <div className={`bf-track ${dense ? 'dense' : ''}`}>
      {VERIFICATION_STAGES.map((s, i) => {
        const cls = i < currentStage ? 'done' : i === currentStage ? 'current' : 'pending';
        return (
          <div key={s.name} className={`stage ${cls}`}>
            <div className="rail" />
            <div className="pip">{i < currentStage ? '✓' : (i + 1).toString().padStart(2, '0').slice(-1)}</div>
            <div className="info">
              <div className="name">{s.name}</div>
              <div className="when">{i < currentStage ? (completedDates[i] || 'Completed') : i === currentStage ? 'In progress' : '—'}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Desktop nav rail (used by all desktop screens)
function DesktopRail({ active = 'dashboard' }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'new', label: 'New request' },
    { id: 'history', label: 'History' },
    { id: 'account', label: 'Account' },
  ];
  return (
    <aside className="bf-rail">
      <div className="rail-brand">
        <VerityMark size={26} />
        <span className="word">VERITY</span>
      </div>
      <nav className="rail-nav">
        {items.map(i => (
          <a key={i.id} className={`rail-item ${active === i.id ? 'active' : ''}`}>
            <span className="dot" />
            <span>{i.label}</span>
          </a>
        ))}
      </nav>
      <div className="rail-foot">
        <div className="rail-user">
          <span className="ava">A</span>
          <div>
            <div className="bf-body" style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}>Adaeze Okonkwo</div>
            <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em' }}>BUYER · TIER 2</div>
          </div>
        </div>
        <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em', marginTop: 16 }}>VERITY · LAGOS</div>
      </div>
    </aside>
  );
}

// ════════════════════════════════════════════════════════════════════
// 2 · SCREENS — each takes `vp` ('phone' | 'tablet-p' | 'tablet-l' | 'desktop')
// Most layouts share the mobile structure, with vp-aware tweaks for tablet
// (more padding, two-col grids) and desktop (rail + wider main + side panel).
// ════════════════════════════════════════════════════════════════════

const isWide = vp => vp === 'tablet-l' || vp === 'desktop';
const isDesktop = vp => vp === 'desktop';

// ─── 02a · Sign up ────────────────────────────────────────────
function ScreenSignup({ vp = 'phone' }) {
  if (isDesktop(vp)) {
    return (
      <div className="bf-auth-split">
        <aside className="auth-marketing">
          <div className="auth-mast">
            <VerityMark size={36} /><span className="word">VERITY</span>
          </div>
          <div className="auth-pull">
            <div className="bf-eyebrow gold" style={{ marginBottom: 24 }}>— Property verification, done properly</div>
            <h1 className="auth-h1">A buyer's <em className="bf-italic">peace of mind</em>, before the wire goes out.</h1>
            <p className="auth-sub">Eight-stage verification by licensed Lagos surveyors. Your report arrives in three to five days, signed and share-safe.</p>
          </div>
          <div className="auth-foot">
            <div className="bf-row" style={{ gap: 32 }}>
              <div><div className="bf-mono mono-stat">2,800+</div><div className="bf-mono mono-cap">VERIFICATIONS</div></div>
              <div><div className="bf-mono mono-stat">97.2%</div><div className="bf-mono mono-cap">CONFIDENCE</div></div>
              <div><div className="bf-mono mono-stat">£2.4B</div><div className="bf-mono mono-cap">PROTECTED</div></div>
            </div>
          </div>
        </aside>
        <main className="auth-form">
          <div className="auth-card">
            <div className="bf-eyebrow" style={{ marginBottom: 14 }}>— Step 01 of 02</div>
            <h2 className="bf-h1" style={{ fontSize: 40, lineHeight: 1.05 }}>Create your <em className="bf-italic">buyer account.</em></h2>
            <p className="bf-small" style={{ marginTop: 12, fontSize: 14 }}>A small piece of housekeeping before we verify a property for you.</p>
            <div className="bf-stack" style={{ gap: 18, marginTop: 28 }}>
              <div className="bf-field"><label className="bf-label">Full name *</label><input className="bf-input" defaultValue="Adaeze Okonkwo" /></div>
              <div className="bf-field"><label className="bf-label">Email *</label><input className="bf-input" defaultValue="adaeze.o@gmail.com" /></div>
              <div className="bf-field"><label className="bf-label">Phone (Nigerian or diaspora)</label><input className="bf-input" defaultValue="+44 7700 900 124" /></div>
              <div className="bf-field"><label className="bf-label">Password *</label><input className="bf-input" type="password" defaultValue="••••••••••••" /><div className="bf-help">Min 12 chars, with one number.</div></div>
            </div>
            <button className="bf-btn primary" style={{ marginTop: 24 }}>Continue <span className="arrow">→</span></button>
            <p className="bf-small" style={{ marginTop: 14, textAlign: 'center', fontSize: 12 }}>Already verified with us? <a className="bf-link">Sign in.</a></p>
          </div>
        </main>
      </div>
    );
  }
  const padX = isWide(vp) ? 56 : 24;
  return (
    <div className="bf-screen">
      <Brand meta="VERITY · BUYER" />
      <div className="bf-grow bf-pad" style={{ paddingLeft: padX, paddingRight: padX, maxWidth: isWide(vp) ? 720 : '100%', margin: isWide(vp) ? '0 auto' : 0 }}>
        <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Step 01 of 02</div>
        <h1 className="bf-h1">Create your <em className="bf-italic">buyer account.</em></h1>
        <p className="bf-small" style={{ marginTop: 10 }}>A small piece of housekeeping before we verify a property for you.</p>
        <div className="bf-stack" style={{ gap: 18, marginTop: 24 }}>
          <div className="bf-field"><label className="bf-label">Full name *</label><input className="bf-input" defaultValue="Adaeze Okonkwo" /></div>
          <div className="bf-field"><label className="bf-label">Email *</label><input className="bf-input" defaultValue="adaeze.o@gmail.com" /></div>
          <div className="bf-field"><label className="bf-label">Phone (Nigerian or diaspora)</label><input className="bf-input" defaultValue="+44 7700 900 124" /></div>
          <div className="bf-field"><label className="bf-label">Password *</label><input className="bf-input" type="password" defaultValue="••••••••••••" /><div className="bf-help">Min 12 chars, with one number.</div></div>
        </div>
        <button className="bf-btn primary" style={{ marginTop: 24 }}>Continue <span className="arrow">→</span></button>
        <p className="bf-small" style={{ marginTop: 14, textAlign: 'center' }}>Already verified with us? <a className="bf-link">Sign in.</a></p>
      </div>
    </div>
  );
}

// ─── 02b · Email sent ─────────────────────────────────────────
function ScreenEmailSent({ vp = 'phone' }) {
  const inner = (
    <>
      <div style={{
        width: 64, height: 64, borderRadius: 999, background: 'var(--cream-shade)',
        border: '1px solid var(--gold)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
      }}>
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
          <rect x="1" y="1" width="20" height="16" rx="2" stroke="#A88A45" strokeWidth="1.5" />
          <path d="M2 3l9 7 9-7" stroke="#A88A45" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Check your inbox</div>
      <h1 className="bf-h1" style={{ maxWidth: '15ch', textAlign: 'center', margin: '0 auto' }}>We've sent a <em className="bf-italic">verification link.</em></h1>
      <p className="bf-small" style={{ marginTop: 16, textAlign: 'center', maxWidth: '32ch', marginInline: 'auto' }}>Open the email at <span className="bf-mono" style={{ fontSize: 12 }}>adaeze.o@gmail.com</span> and click the link to continue.</p>
      <div className="bf-divider gold" style={{ margin: '24px auto' }} />
      <p className="bf-small" style={{ textAlign: 'center' }}>Didn't receive it? Check spam, or <a className="bf-link">resend in 0:42</a>.</p>
    </>
  );
  if (isDesktop(vp)) {
    return (
      <div className="bf-auth-split">
        <aside className="auth-marketing"><div className="auth-mast"><VerityMark size={36} /><span className="word">VERITY</span></div></aside>
        <main className="auth-form"><div className="auth-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{inner}</div></main>
      </div>
    );
  }
  return (
    <div className="bf-screen">
      <Brand meta="VERITY · BUYER" />
      <div className="bf-grow bf-pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>{inner}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// REQUEST WIZARD (5 screens)
// ════════════════════════════════════════════════════════════════════

const REQUEST_STEPS = ['Property', 'Documents', 'Tier', 'Payment', 'Confirm'];

function ScreenRequestProperty({ vp = 'phone' }) {
  const body = (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Property details</div>
      <h2 className="bf-h2">Tell us about <em className="bf-italic">the property</em> you want verified.</h2>
      <div className="bf-stack" style={{ gap: 18, marginTop: 24 }}>
        <div className="bf-field">
          <label className="bf-label">Property type *</label>
          <div className="bf-seg"><button className="on">Residential</button><button>Commercial</button><button>Mixed-use</button><button>Land</button></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isWide(vp) ? '1fr 1fr' : '1fr', gap: 12 }}>
          <div className="bf-field">
            <label className="bf-label">State *</label>
            <div className="bf-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span>Lagos State</span><span className="bf-mono" style={{ color: 'var(--slate)', fontSize: 10 }}>NG-LA</span></div>
          </div>
          <div className="bf-field"><label className="bf-label">Local Government Area *</label><input className="bf-input" defaultValue="Eti-Osa" /></div>
        </div>
        <div className="bf-field"><label className="bf-label">Plot address *</label><textarea className="bf-textarea" defaultValue="Plot 27B, Admiralty Way, Lekki Phase 1, Lagos." /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="bf-field"><label className="bf-label">Plot no. <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span></label><input className="bf-input mono" defaultValue="LEK/PH1/27B" /></div>
          <div className="bf-field"><label className="bf-label">Size (sqm) <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span></label><input className="bf-input mono" defaultValue="640" /></div>
        </div>
      </div>
    </>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="new" right={<RequestSidebar step={0} />}>
        <PageHead step="REQUEST · 1 OF 5" title="New verification">
          <StepBar steps={REQUEST_STEPS} current={0} />
        </PageHead>
        <div style={{ maxWidth: 720 }}>{body}</div>
        <div style={{ marginTop: 32, display: 'flex', gap: 14 }}>
          <button className="bf-btn outline" style={{ width: 110 }}>Back</button>
          <button className="bf-btn primary">Continue <span className="arrow">→</span></button>
        </div>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar title="NEW REQUEST" right={<span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>1 OF 5</span>} />
      <StepBar steps={REQUEST_STEPS} current={0} />
      <div className="bf-grow bf-pad" style={{ maxWidth: isWide(vp) ? 620 : '100%', marginInline: 'auto' }}>{body}</div>
      <div className="bf-stickybar">
        <button className="bf-btn outline" style={{ flex: 'none', width: 88 }}>Back</button>
        <button className="bf-btn primary">Continue <span className="arrow">→</span></button>
      </div>
    </div>
  );
}

function ScreenRequestDocs({ vp = 'phone' }) {
  const body = (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Documents</div>
      <h2 className="bf-h2">Upload anything <em className="bf-italic">the seller has given you.</em></h2>
      <p className="bf-small" style={{ marginTop: 10 }}>Originals or photographs both fine. Encrypted on receipt; only verification specialists can open them.</p>
      <div className="bf-upload" style={{ marginTop: 18 }}>
        <div className="iconw"><svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path d="M8 12V2M8 2L4 6M8 2l4 4M2 13v3h12v-3" stroke="#1E2260" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <div className="bf-body" style={{ fontSize: 14, fontWeight: 500 }}>Drop files or tap to browse</div>
        <div className="bf-small" style={{ marginTop: 4, fontSize: 12 }}>PDF · JPG · PNG · HEIC · max 25 MB each</div>
      </div>
      <div className="bf-stack" style={{ gap: 10, marginTop: 18 }}>
        {[
          { ext: 'PDF', name: 'CofO_Lekki_Plot27B.pdf', sub: '2.4 MB · Certificate of Occupancy', mark: '✓' },
          { ext: 'JPG', name: 'survey_plan_signed.jpg', sub: '1.1 MB · Survey Plan', mark: '✓' },
          { ext: 'PDF', name: 'deed_of_assignment.pdf', sub: '3.7 MB · Tap to label', mark: '···' },
        ].map(d => (
          <div key={d.name} className="bf-doc">
            <div className="thumb">{d.ext}</div>
            <div className="meta"><div className="name">{d.name}</div><div className="sub">{d.sub}</div></div>
            <span className="bf-mono" style={{ color: d.mark === '···' ? 'var(--slate)' : 'var(--gold-deep)', fontSize: 10 }}>{d.mark}</span>
          </div>
        ))}
      </div>
      <div className="bf-row" style={{ gap: 10, marginTop: 22, alignItems: 'flex-start' }}>
        <span className="bf-check" />
        <div className="bf-small" style={{ lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--navy)' }}>I don't have any documents yet.</strong>
          <span style={{ display: 'block', marginTop: 2 }}>We can still verify the plot — confidence ceiling will be capped at <span className="bf-mono" style={{ fontSize: 11, color: 'var(--gold-deep)' }}>BRONZE</span>.</span>
        </div>
      </div>
    </>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="new" right={<RequestSidebar step={1} />}>
        <PageHead step="REQUEST · 2 OF 5" title="Documents"><StepBar steps={REQUEST_STEPS} current={1} /></PageHead>
        <div style={{ maxWidth: 720 }}>{body}</div>
        <div style={{ marginTop: 32, display: 'flex', gap: 14 }}>
          <button className="bf-btn outline" style={{ width: 110 }}>Back</button>
          <button className="bf-btn primary">Continue <span className="arrow">→</span></button>
        </div>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar title="NEW REQUEST" right={<span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>2 OF 5</span>} />
      <StepBar steps={REQUEST_STEPS} current={1} />
      <div className="bf-grow bf-pad" style={{ maxWidth: isWide(vp) ? 620 : '100%', marginInline: 'auto' }}>{body}</div>
      <div className="bf-stickybar">
        <button className="bf-btn outline" style={{ flex: 'none', width: 88 }}>Back</button>
        <button className="bf-btn primary">Continue <span className="arrow">→</span></button>
      </div>
    </div>
  );
}

function TierCards({ wide }) {
  const t1 = (
    <div className="bf-card tier" key="std">
      <span className="check" />
      <div className="bf-row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="bf-mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--slate)', textTransform: 'uppercase' }}>— Standard</span>
        <span className="bf-mono" style={{ fontSize: 11, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>5–7 BUSINESS DAYS</span>
      </div>
      <div className="bf-h2" style={{ marginTop: 6, fontWeight: 500 }}>₦50,000</div>
      <div className="bf-divider" style={{ margin: '12px 0' }} />
      <ul className="bf-evi">
        <li><span className="mark">✓</span><div className="body"><div className="h">Document authenticity check</div></div></li>
        <li><span className="mark">✓</span><div className="body"><div className="h">Lagos State Land Registry crosscheck</div></div></li>
        <li><span className="mark">✓</span><div className="body"><div className="h">VPID graph — competing-claims search</div></div></li>
        <li className="miss"><span className="mark">—</span><div className="body"><div className="h" style={{ color: 'var(--slate)' }}>Physical site visit</div></div></li>
      </ul>
      <div className="bf-row" style={{ marginTop: 12, gap: 8 }}>
        <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.2em' }}>MAX BAND</span><BandPill tier="silver" />
      </div>
    </div>
  );
  const t2 = (
    <div className="bf-card tier selected" key="prem">
      <span className="check"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#1E2260" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      <div className="bf-row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="bf-mono" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--gold-deep)', textTransform: 'uppercase' }}>— Premium</span>
        <span className="bf-mono" style={{ fontSize: 11, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>3–5 BUSINESS DAYS</span>
      </div>
      <div className="bf-h2" style={{ marginTop: 6, fontWeight: 500 }}>₦150,000</div>
      <div className="bf-divider" style={{ margin: '12px 0' }} />
      <ul className="bf-evi">
        <li><span className="mark">✓</span><div className="body"><div className="h">Everything in Standard</div></div></li>
        <li><span className="mark">✓</span><div className="body"><div className="h">Physical site visit by licensed surveyor</div></div></li>
        <li><span className="mark">✓</span><div className="body"><div className="h">Survey plan accuracy crosscheck</div></div></li>
        <li><span className="mark">✓</span><div className="body"><div className="h">Sworn specialist sign-off</div></div></li>
      </ul>
      <div className="bf-row" style={{ marginTop: 12, gap: 8 }}>
        <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.2em' }}>MAX BAND</span><BandPill tier="platinum" />
      </div>
    </div>
  );
  return (
    <div className="bf-stack" style={wide ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 22 } : { gap: 14, marginTop: 22 }}>{[t1, t2]}</div>
  );
}

function ScreenRequestTier({ vp = 'phone' }) {
  const body = (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Choose your tier</div>
      <h2 className="bf-h2">How <em className="bf-italic">deep</em> should we go?</h2>
      <TierCards wide={isWide(vp)} />
      <p className="bf-small" style={{ marginTop: 18, fontStyle: 'italic', textAlign: 'center', color: 'var(--slate)' }}>Most diaspora buyers choose Premium when wiring more than ₦40m.</p>
    </>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="new" right={<RequestSidebar step={2} />}>
        <PageHead step="REQUEST · 3 OF 5" title="Choose your tier"><StepBar steps={REQUEST_STEPS} current={2} /></PageHead>
        <div style={{ maxWidth: 880 }}>{body}</div>
        <div style={{ marginTop: 32, display: 'flex', gap: 14, alignItems: 'center' }}>
          <button className="bf-btn outline" style={{ width: 110 }}>Back</button>
          <button className="bf-btn primary">Continue <span className="arrow">→</span></button>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>SUBTOTAL</div>
            <div className="bf-h2" style={{ fontWeight: 500, marginTop: 2 }}>₦150,000</div>
          </div>
        </div>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar title="NEW REQUEST" right={<span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>3 OF 5</span>} />
      <StepBar steps={REQUEST_STEPS} current={2} />
      <div className="bf-grow bf-pad">{body}</div>
      <div className="bf-stickybar">
        <div className="total"><span className="label">Subtotal</span><span className="amount">₦150,000</span></div>
        <button className="bf-btn primary">Continue <span className="arrow">→</span></button>
      </div>
    </div>
  );
}

function PaymentForm() {
  return (
    <div className="bf-stack" style={{ gap: 14, marginTop: 22 }}>
      <div className="bf-field"><label className="bf-label">Card number</label><input className="bf-input mono" defaultValue="4 4 8 5    •••• ••••    9 0 2 1" /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="bf-field"><label className="bf-label">Expiry</label><input className="bf-input mono" defaultValue="08 / 28" /></div>
        <div className="bf-field"><label className="bf-label">CVC</label><input className="bf-input mono" defaultValue="•••" /></div>
      </div>
    </div>
  );
}

function OrderSummary() {
  return (
    <div className="bf-card cream" style={{ marginTop: 18, padding: 16 }}>
      <div className="bf-row" style={{ justifyContent: 'space-between' }}>
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em' }}>ORDER SUMMARY</span>
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>VPR-PENDING</span>
      </div>
      <div className="bf-divider" style={{ margin: '12px 0' }} />
      <div className="bf-stack" style={{ gap: 6 }}>
        <div className="bf-row" style={{ justifyContent: 'space-between' }}><span className="bf-small" style={{ color: 'var(--navy)' }}>Premium verification</span><span className="bf-mono" style={{ fontSize: 13, color: 'var(--navy)' }}>₦150,000</span></div>
        <div className="bf-row" style={{ justifyContent: 'space-between' }}><span className="bf-small">Plot 27B, Admiralty Way</span><span className="bf-small" style={{ fontStyle: 'italic' }}>Lekki Phase 1</span></div>
      </div>
      <div className="bf-divider" style={{ margin: '12px 0' }} />
      <div className="bf-row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em' }}>TOTAL</span>
        <span className="bf-h2" style={{ fontWeight: 500 }}>₦150,000 <span className="bf-small" style={{ color: 'var(--slate)', fontSize: 12 }}>· £75 approx</span></span>
      </div>
    </div>
  );
}

function ScreenRequestPayment({ vp = 'phone' }) {
  const methods = (
    <div className="bf-stack" style={{ gap: 8 }}>
      <div className="bf-card tier selected" style={{ padding: 14 }}>
        <span className="check"><svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#1E2260" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        <div className="bf-row" style={{ gap: 12, alignItems: 'center' }}>
          <div style={{ width: 36, height: 24, borderRadius: 3, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="bf-mono" style={{ color: 'var(--gold)', fontSize: 9, letterSpacing: '0.1em' }}>VISA</span></div>
          <div><div className="bf-body" style={{ fontSize: 14, fontWeight: 500 }}>Card · International accepted</div><div className="bf-small" style={{ fontSize: 11, marginTop: 2 }}>Paystack · processed in £ for diaspora cards</div></div>
        </div>
      </div>
      <div className="bf-card tier" style={{ padding: 14 }}>
        <span className="check" />
        <div className="bf-row" style={{ gap: 12, alignItems: 'center' }}>
          <div style={{ width: 36, height: 24, borderRadius: 3, background: 'var(--cream-shade)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="bf-mono" style={{ color: 'var(--navy)', fontSize: 9, letterSpacing: '0.1em' }}>NGN</span></div>
          <div><div className="bf-body" style={{ fontSize: 14, fontWeight: 500 }}>Bank transfer · Nigerian account</div><div className="bf-small" style={{ fontSize: 11, marginTop: 2 }}>Instant verification via Paystack</div></div>
        </div>
      </div>
    </div>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="new" right={<OrderSummary />}>
        <PageHead step="REQUEST · 4 OF 5" title="Payment"><StepBar steps={REQUEST_STEPS} current={3} /></PageHead>
        <div style={{ maxWidth: 720 }}>
          <div className="bf-eyebrow slate" style={{ marginTop: 6, marginBottom: 8 }}>— Method</div>
          {methods}
          <PaymentForm />
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 14, alignItems: 'center' }}>
          <button className="bf-btn outline" style={{ width: 110 }}>Back</button>
          <button className="bf-btn gold">Pay &amp; submit <span className="arrow">→</span></button>
        </div>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar title="NEW REQUEST" right={<span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>4 OF 5</span>} />
      <StepBar steps={REQUEST_STEPS} current={3} />
      <div className="bf-grow bf-pad">
        <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Payment</div>
        <h2 className="bf-h2">Settle in <em className="bf-italic">naira or sterling.</em></h2>
        <OrderSummary />
        <div className="bf-eyebrow slate" style={{ marginTop: 22, marginBottom: 8 }}>— Method</div>
        {methods}
        <PaymentForm />
      </div>
      <div className="bf-stickybar">
        <div className="total"><span className="label">Total</span><span className="amount">₦150,000</span></div>
        <button className="bf-btn gold">Pay &amp; submit <span className="arrow">→</span></button>
      </div>
    </div>
  );
}

function ScreenRequestConfirmed({ vp = 'phone' }) {
  const card = (
    <div className="bf-card cream" style={{ marginTop: 24, padding: 18 }}>
      <div className="bf-stack" style={{ gap: 12 }}>
        <div><div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>YOUR REPORT REFERENCE</div><div className="bf-mono" style={{ fontSize: 16, color: 'var(--navy)', letterSpacing: '0.16em', marginTop: 4 }}>VPR-2026-005847</div></div>
        <div className="bf-divider" />
        <div><div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>EXPECTED DELIVERY</div><div className="bf-body" style={{ fontSize: 16, marginTop: 4, color: 'var(--navy)' }}>By <em className="bf-italic">Tuesday, 12 May</em> · 3–5 business days</div></div>
        <div className="bf-divider" />
        <div><div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>PROPERTY</div><div className="bf-body" style={{ fontSize: 14, marginTop: 4, color: 'var(--navy)' }}>Plot 27B, Admiralty Way, Lekki Phase 1</div></div>
      </div>
    </div>
  );
  const head = (
    <>
      <div style={{ width: 60, height: 60, borderRadius: 999, background: 'var(--gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <svg width="24" height="20" viewBox="0 0 24 20" fill="none"><path d="M2 10l8 8L22 2" stroke="#1E2260" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Request received</div>
      <h1 className="bf-h1" style={{ maxWidth: '20ch', margin: '0 auto' }}>The work has <em className="bf-italic">begun.</em></h1>
    </>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="new">
        <div style={{ maxWidth: 640, margin: '40px auto', textAlign: 'center' }}>
          {head}{card}
          <p className="bf-small" style={{ marginTop: 20, lineHeight: 1.55, textAlign: 'left' }}>A confirmation has been sent to <span className="bf-mono" style={{ fontSize: 11 }}>adaeze.o@gmail.com</span>. We'll WhatsApp you when each stage closes — quietly, no marketing.</p>
          <div style={{ marginTop: 24, display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button className="bf-btn primary">Track this request <span className="arrow">→</span></button>
            <button className="bf-btn ghost">Back to dashboard</button>
          </div>
        </div>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <Brand meta="VERITY · BUYER" />
      <div className="bf-grow bf-pad" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginTop: 18 }}>{head}</div>
        {card}
        <p className="bf-small" style={{ marginTop: 20, lineHeight: 1.55 }}>A confirmation has been sent to <span className="bf-mono" style={{ fontSize: 11 }}>adaeze.o@gmail.com</span>. We'll WhatsApp you when each stage closes — quietly, no marketing.</p>
      </div>
      <div className="bf-pad" style={{ paddingTop: 0, gap: 10, display: 'flex', flexDirection: 'column' }}>
        <button className="bf-btn primary">Track this request <span className="arrow">→</span></button>
        <button className="bf-btn ghost">Back to dashboard</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// DASHBOARD + STATUS + CERTIFICATE + DISTRIBUTE
// ════════════════════════════════════════════════════════════════════

function ActiveRequestRow({ wide }) {
  return (
    <div className="bf-req">
      <div>
        <div className="addr">Plot 27B, Admiralty Way{wide ? ', ' : <br/>}Lekki Phase 1</div>
        <div className="vpid">VPR-2026-005847 · Premium</div>
      </div>
      <div className="right">
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>STAGE 04 / 08</span>
        <span className="when">Day 2 of 5</span>
        <BandPill tier="prov" />
      </div>
    </div>
  );
}

function ScreenBuyerDashboard({ vp = 'phone' }) {
  const past = [
    { addr: '14 Bourdillon Rd', city: 'Ikoyi', vpid: 'VRT-7QH3M9XKR', when: '12 Mar 2026', tier: 'gold', score: 84 },
    { addr: 'Plot 9, Banana Island', city: 'Foreshore Estate', vpid: 'VRT-K3M9P2HN8', when: '8 Feb 2026', tier: 'bronze', score: 58 },
  ];
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="dashboard">
        <PageHead eyebrow="Welcome back, Adaeze" title={<>You have <em className="bf-italic">one</em> verification in flight.</>} />
        <div className="bf-eyebrow slate" style={{ marginBottom: 10 }}>— Active</div>
        <ActiveRequestRow wide />
        <div className="bf-eyebrow slate" style={{ marginTop: 32, marginBottom: 10 }}>— Past verifications</div>
        <table className="bf-table">
          <thead><tr><th>Property</th><th>Reference</th><th>Verified</th><th>Confidence</th><th></th></tr></thead>
          <tbody>{past.map(p => (
            <tr key={p.vpid}>
              <td><div style={{ fontWeight: 500 }}>{p.addr}</div><div className="bf-small">{p.city}</div></td>
              <td><span className="bf-mono" style={{ fontSize: 11, color: 'var(--navy)', letterSpacing: '0.14em' }}>{p.vpid}</span></td>
              <td>{p.when}</td>
              <td><BandPill tier={p.tier} score={p.score} /></td>
              <td style={{ textAlign: 'right' }}><a className="bf-link">View certificate →</a></td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{ marginTop: 32 }}><button className="bf-btn primary" style={{ width: 280 }}>+ &nbsp; Start a new verification</button></div>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar back={false} title="VERITY" right={<span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--navy)', color: 'var(--cream)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 14 }}>A</span>} />
      <BuyerTabs active="dashboard" />
      <div className="bf-grow">
        <div className="bf-pad" style={{ paddingBottom: 12 }}>
          <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Welcome back, Adaeze</div>
          <h2 className="bf-h2">You have <em className="bf-italic">one</em> verification in flight.</h2>
        </div>
        <div className="bf-eyebrow slate" style={{ paddingLeft: 20, paddingRight: 20, fontSize: 9, marginTop: 6 }}>— Active</div>
        <ActiveRequestRow />
        <div className="bf-eyebrow slate" style={{ paddingLeft: 20, paddingRight: 20, fontSize: 9, marginTop: 22 }}>— Past verifications</div>
        {past.map(p => (
          <div key={p.vpid} className="bf-req">
            <div><div className="addr">{p.addr}<br/>{p.city}</div><div className="vpid">{p.vpid} · {p.when}</div></div>
            <div className="right"><span className="when">View certificate</span><BandPill tier={p.tier} score={p.score} /></div>
          </div>
        ))}
        <div className="bf-pad" style={{ paddingTop: 28 }}><button className="bf-btn outline">+ &nbsp; Start a new verification</button></div>
      </div>
    </div>
  );
}

function ScreenStatusInProgress({ vp = 'phone' }) {
  const head = (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— VPR-2026-005847</div>
      <h2 className="bf-h2">Plot 27B, Admiralty Way<br/><em className="bf-italic" style={{ fontSize: 18 }}>Lekki Phase 1, Lagos.</em></h2>
      <div className="bf-row" style={{ gap: 10, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <BandPill tier="prov" />
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.16em' }}>PREMIUM · ₦150,000</span>
      </div>
    </>
  );
  const eta = (
    <div className="bf-pad" style={{ background: 'var(--cream-shade)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', paddingTop: 18, paddingBottom: 18 }}>
      <div className="bf-row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em' }}>EXPECTED BY</span>
        <span className="bf-h3" style={{ fontWeight: 500 }}>Tue, 12 May</span>
      </div>
      <div className="bf-row" style={{ gap: 4, marginTop: 12 }}>
        {[0,1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < 2 ? 'var(--gold)' : 'var(--cream-deep)' }} />)}
      </div>
      <div className="bf-row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
        <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em' }}>DAY 02</span>
        <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em' }}>OF 05</span>
      </div>
    </div>
  );
  const note = (
    <div className="bf-card" style={{ padding: 14 }}>
      <div className="bf-row" style={{ justifyContent: 'space-between' }}>
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>SPECIALIST · IFEOMA O.</span>
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>9 MAY · 10:32</span>
      </div>
      <p className="bf-body" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.55 }}>Field visit scheduled for tomorrow morning, <em className="bf-italic">10 May</em>. We've already confirmed the CofO filing date against the Lagos State Land Registry.</p>
    </div>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="dashboard" right={
        <div>
          <div className="bf-eyebrow slate" style={{ marginBottom: 10 }}>— ETA</div>
          <div className="bf-h3" style={{ fontWeight: 500 }}>Tue, 12 May</div>
          <div className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', marginTop: 4 }}>DAY 02 / 05</div>
          <div className="bf-row" style={{ gap: 4, marginTop: 12 }}>
            {[0,1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < 2 ? 'var(--gold)' : 'var(--cream-deep)' }} />)}
          </div>
          <div style={{ marginTop: 26 }}>{note}</div>
        </div>
      }>
        {head}
        <div className="bf-eyebrow slate" style={{ marginTop: 32, marginBottom: 16 }}>— Verification track</div>
        <StatusTrack currentStage={3} completedDates={{ 0: '8 May · 14:12', 1: '8 May · 22:40', 2: '9 May · 10:30' }} />
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar title="VERITY" />
      <div className="bf-grow">
        <div className="bf-pad" style={{ paddingBottom: 14 }}>{head}</div>
        {eta}
        <div className="bf-pad">
          <div className="bf-eyebrow slate" style={{ marginBottom: 16 }}>— Verification track</div>
          <StatusTrack currentStage={3} completedDates={{ 0: '8 May · 14:12', 1: '8 May · 22:40', 2: '9 May · 10:30' }} />
        </div>
        <div className="bf-pad" style={{ paddingTop: 0 }}>
          <div className="bf-eyebrow slate" style={{ marginBottom: 10 }}>— From the team</div>
          {note}
        </div>
      </div>
    </div>
  );
}

function ScreenStatusAwaiting({ vp = 'phone' }) {
  const flag = (
    <div className="bf-notice action">
      <span className="mark">⚑</span>
      <div>
        <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)' }}>WE NEED ONE THING</div>
        <p style={{ margin: '6px 0 0', lineHeight: 1.5, fontSize: 14, color: 'var(--cream)' }}>The Survey Plan you uploaded is missing the surveyor's seal on page 2. Could you upload a clearer scan?</p>
        <a className="bf-link" style={{ display: 'inline-block', marginTop: 12, color: 'var(--gold)', borderBottomColor: 'var(--gold)' }}>Upload replacement document →</a>
      </div>
    </div>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="dashboard">
        <PageHead eyebrow="VPR-2026-005847" title={<>14 Bourdillon Rd, <em className="bf-italic">Ikoyi.</em></>} />
        {flag}
        <div className="bf-eyebrow slate" style={{ marginTop: 32, marginBottom: 16 }}>— Verification paused at stage 02</div>
        <StatusTrack currentStage={1} completedDates={{ 0: '8 May · 14:12' }} />
        <p className="bf-small" style={{ marginTop: 16, fontStyle: 'italic' }}>We'll resume immediately after you upload — typically within minutes.</p>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar title="VERITY" />
      <div className="bf-grow">
        <div className="bf-pad" style={{ paddingBottom: 14 }}>
          <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— VPR-2026-005847</div>
          <h2 className="bf-h2">14 Bourdillon Rd<br/><em className="bf-italic" style={{ fontSize: 18 }}>Ikoyi, Lagos.</em></h2>
        </div>
        <div className="bf-pad-x">{flag}</div>
        <div className="bf-pad">
          <div className="bf-eyebrow slate" style={{ marginBottom: 16 }}>— Verification paused at stage 02</div>
          <StatusTrack currentStage={1} completedDates={{ 0: '8 May · 14:12' }} />
          <p className="bf-small" style={{ marginTop: 16, fontStyle: 'italic' }}>We'll resume immediately after you upload — typically within minutes.</p>
        </div>
      </div>
    </div>
  );
}

function ScreenStatusComplete({ vp = 'phone' }) {
  const evi = (
    <ul className="bf-evi">
      <li><span className="mark">✓</span><div className="body"><div className="h">Document authenticity</div><div className="ref">CofO ref · LS/2019/047/A · cross-checked</div></div></li>
      <li><span className="mark">✓</span><div className="body"><div className="h">Plot exists at the stated coordinates</div><div className="ref">Field visit · 10 May · I. Okafor (NIESV 4892)</div></div></li>
      <li><span className="mark">✓</span><div className="body"><div className="h">Registry filing matches submitted documents</div><div className="ref">LS Land Registry · filing 11 Aug 2019</div></div></li>
      <li><span className="mark">✓</span><div className="body"><div className="h">No competing claims found</div><div className="ref">VPID graph · scanned 11 May</div></div></li>
      <li className="miss"><span className="mark">!</span><div className="body"><div className="h">Survey plan boundary — minor discrepancy</div><div className="ref">~1.4m variance on east boundary · see flag below</div></div></li>
    </ul>
  );
  const warn = (
    <div className="bf-notice warn">
      <span className="mark">!</span>
      <div>
        <strong style={{ color: 'var(--navy)' }}>Boundary variance — east edge.</strong>
        <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5 }}>The registered survey plan and the on-site measurement differ by ~1.4m on the east boundary. Worth raising with the seller before signing.</p>
      </div>
    </div>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="dashboard" right={<div><BandBlock tier="gold" score={84} clarify="High confidence on documents and registry; one minor flag on plot boundary." /></div>}>
        <PageHead eyebrow="VPR-2026-005612" title={<>14 Bourdillon Rd, <em className="bf-italic">Ikoyi.</em></>}>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <button className="bf-btn outline" style={{ width: 160 }}>Download PDF</button>
            <button className="bf-btn gold" style={{ width: 200 }}>Share verification</button>
          </div>
        </PageHead>
        <div className="bf-eyebrow slate" style={{ marginTop: 24, marginBottom: 8 }}>— What we confirmed</div>
        {evi}
        <div className="bf-eyebrow" style={{ color: 'var(--warn)', marginTop: 28, marginBottom: 8 }}>⚑ Flags raised</div>
        {warn}
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar title="VERITY" />
      <div className="bf-grow">
        <div className="bf-pad" style={{ paddingBottom: 14 }}>
          <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— VPR-2026-005612</div>
          <h2 className="bf-h2">14 Bourdillon Rd<br/><em className="bf-italic" style={{ fontSize: 18 }}>Ikoyi, Lagos.</em></h2>
        </div>
        <div className="bf-pad-x" style={{ paddingTop: 4 }}><BandBlock tier="gold" score={84} clarify="High confidence on documents and registry; one minor flag on plot boundary." /></div>
        <div className="bf-pad">
          <div className="bf-eyebrow slate" style={{ marginBottom: 8 }}>— What we confirmed</div>
          {evi}
        </div>
        <div className="bf-pad" style={{ paddingTop: 0 }}>
          <div className="bf-eyebrow" style={{ color: 'var(--warn)', marginBottom: 8 }}>⚑ Flags raised</div>
          {warn}
        </div>
      </div>
      <div className="bf-stickybar">
        <button className="bf-btn outline" style={{ flex: 'none', width: 130 }}>Download PDF</button>
        <button className="bf-btn gold">Share verification</button>
      </div>
    </div>
  );
}

function CertMasthead() {
  return (
    <div className="bf-cert-mast">
      <div className="word">VERITY</div>
      <span className="gilt" />
      <div className="label">— Verification Report —</div>
      <div className="bf-mono" style={{ fontSize: 11, color: 'var(--navy)', letterSpacing: '0.18em', marginTop: 8 }}>VPR-2026-005612</div>
    </div>
  );
}

function CertProperty() {
  return (
    <div className="bf-card" style={{ padding: 18 }}>
      <div className="bf-eyebrow slate" style={{ marginBottom: 10, fontSize: 9 }}>— Property identification</div>
      <div className="bf-h3" style={{ marginTop: 4, fontSize: 18, fontWeight: 500 }}>14 Bourdillon Road</div>
      <div className="bf-body" style={{ fontStyle: 'italic', color: 'var(--slate)', fontSize: 14, marginTop: 2 }}>Ikoyi, Lagos State, Nigeria</div>
      <div className="bf-divider" style={{ margin: '14px 0' }} />
      <div className="bf-stack" style={{ gap: 8 }}>
        {[
          ['VPID', 'VRT-7QH3M9XKR'],
          ['PLOT NO.', 'IK/BRD/14'],
          ['TYPE', 'Residential · 920 sqm'],
          ['VERIFIED', '12 MAR 2026'],
        ].map(([k, v]) => (
          <div key={k} className="bf-row" style={{ justifyContent: 'space-between' }}>
            <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.2em' }}>{k}</span>
            <span className="bf-mono" style={{ fontSize: 12, color: 'var(--navy)', letterSpacing: '0.14em' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertSign() {
  return (
    <div className="bf-row" style={{ alignItems: 'flex-start', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div className="bf-eyebrow slate" style={{ fontSize: 9 }}>— Specialist sign-off</div>
        <div className="bf-h3" style={{ fontStyle: 'italic', fontWeight: 500, marginTop: 6 }}>Ifeoma Okafor</div>
        <div className="bf-small" style={{ fontSize: 12, marginTop: 2 }}>Licensed Estate Surveyor &amp; Valuer</div>
        <div className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.14em', marginTop: 6 }}>NIESV REG. NO. 4892</div>
        <div className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.14em', marginTop: 2 }}>SIGNED · 12 MAR 2026</div>
      </div>
      <div style={{ width: 72, height: 72, borderRadius: 999, border: '1.5px solid var(--gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 4, borderRadius: 999, border: '1px dashed var(--gold)', opacity: 0.5 }} />
        <span style={{ fontFamily: 'var(--f-mark)', fontSize: 22, color: 'var(--navy)', letterSpacing: '0.05em' }}>V</span>
      </div>
    </div>
  );
}

function CertFoot() {
  return (
    <>
      <div className="bf-divider" />
      <div className="bf-row" style={{ marginTop: 14, gap: 14, alignItems: 'flex-start' }}>
        <div className="bf-qr" />
        <div style={{ flex: 1 }}>
          <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>PUBLIC URL — SHARE-SAFE</div>
          <div className="bf-mono" style={{ fontSize: 12, color: 'var(--navy)', letterSpacing: '0.06em', marginTop: 6, lineHeight: 1.4, wordBreak: 'break-all' }}>verity.properties/v/<br/>VRT-7QH3M9XKR</div>
          <div className="bf-small" style={{ fontStyle: 'italic', fontSize: 11, marginTop: 6 }}>Type this directly into your browser to confirm authenticity.</div>
        </div>
      </div>
      <div className="bf-divider" style={{ marginTop: 14 }} />
      <p className="bf-small" style={{ fontSize: 11, lineHeight: 1.55, color: 'var(--slate)', marginTop: 12 }}>Issued by Verity Property Technologies Ltd. (RC 7842910). This certificate reflects data as of 12 Mar 2026 and is valid for 12 months.</p>
    </>
  );
}

function ScreenCertificate({ vp = 'phone' }) {
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="history">
        <div className="bf-cert-letter">
          <CertMasthead />
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'start' }}>
            <BandBlock tier="gold" score={84} clarify="High confidence on documents and registry; one minor flag on plot boundary." />
            <CertProperty />
          </div>
          <div className="bf-divider gold" style={{ margin: '32px auto' }} />
          <CertSign />
          <div style={{ marginTop: 28 }}><CertFoot /></div>
          <div style={{ marginTop: 32, display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
            <button className="bf-btn outline" style={{ width: 140 }}>Download</button>
            <button className="bf-btn gold" style={{ width: 200 }}>Share <span className="arrow">→</span></button>
          </div>
        </div>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen">
      <AppBar title="CERTIFICATE" right={<span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>VRT-7QH3M9XKR</span>} />
      <div className="bf-grow">
        <CertMasthead />
        <div className="bf-pad" style={{ paddingTop: 20, paddingBottom: 14 }}>
          <BandBlock tier="gold" score={84} clarify="High confidence on documents and registry; one minor flag on plot boundary." />
        </div>
        <div className="bf-pad" style={{ paddingTop: 0 }}><CertProperty /></div>
        <div className="bf-pad" style={{ paddingTop: 6 }}>
          <div className="bf-divider gold" style={{ margin: '0 auto 16px' }} />
          <CertSign />
        </div>
        <div className="bf-pad" style={{ paddingTop: 18 }}><CertFoot /></div>
      </div>
      <div className="bf-stickybar">
        <button className="bf-btn outline" style={{ flex: 'none', width: 116 }}>Download</button>
        <button className="bf-btn gold">Share <span className="arrow">→</span></button>
      </div>
    </div>
  );
}

function ScreenDistribute({ vp = 'phone' }) {
  const sheet = (
    <>
      <div className="bf-pad" style={{ paddingTop: 4, paddingBottom: 8 }}>
        <div className="bf-eyebrow" style={{ marginBottom: 8 }}>— Share verification</div>
        <h3 className="bf-h2" style={{ fontSize: 22 }}>Send to your <em className="bf-italic">lawyer</em>, your bank, or your family.</h3>
        <p className="bf-small" style={{ marginTop: 8 }}>The link is share-safe and works without an account.</p>
      </div>
      <div className="bf-pad" style={{ paddingTop: 8, paddingBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--line-strong)', borderRadius: 6, background: '#fff', padding: '12px 14px' }}>
          <span className="bf-mono" style={{ fontSize: 11, color: 'var(--navy)', letterSpacing: '0.06em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>verity.properties/v/VRT-7QH3M9XKR</span>
          <button className="bf-mono" style={{ border: '1px solid var(--gold)', background: 'var(--gold)', color: 'var(--navy)', padding: '6px 10px', borderRadius: 4, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Copy</button>
        </div>
      </div>
      <div className="bf-pad" style={{ paddingTop: 4, paddingBottom: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'WhatsApp', sub: 'Quick share' },
            { label: 'Email',    sub: 'Lawyer / bank' },
            { label: 'PDF',      sub: 'Download' },
            { label: 'QR',       sub: 'Print / scan' },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--cream-shade)', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <span className="bf-mono" style={{ fontSize: 9, color: 'var(--navy)', letterSpacing: '0.1em' }}>{m.label.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="bf-small" style={{ fontSize: 12, color: 'var(--navy)' }}>{m.label}</div>
              <div className="bf-mono" style={{ fontSize: 8, color: 'var(--slate)', letterSpacing: '0.14em', marginTop: 2 }}>{m.sub.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bf-pad" style={{ paddingTop: 18, paddingBottom: 8 }}>
        <div className="bf-eyebrow slate" style={{ marginBottom: 8, fontSize: 9 }}>— Or send directly</div>
        <div className="bf-field">
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="bf-input" placeholder="lawyer@example.com" defaultValue="kola@chambers.ng" style={{ flex: 1 }} />
            <button className="bf-btn primary" style={{ width: 84, height: 48 }}>Send</button>
          </div>
          <div className="bf-help">We'll attach the PDF and a one-line note in Verity's signature.</div>
        </div>
      </div>
      <div className="bf-pad" style={{ paddingTop: 6, paddingBottom: 0 }}><button className="bf-btn ghost">Close</button></div>
    </>
  );
  if (isDesktop(vp)) {
    return (
      <DesktopShell active="history">
        <div style={{ position: 'relative' }}>
          <div style={{ opacity: 0.45, pointerEvents: 'none', filter: 'blur(1px)' }}>
            <div className="bf-cert-letter"><CertMasthead /><div style={{ marginTop: 24 }}><BandBlock tier="gold" score={84} /></div></div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(23,26,74,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="bf-share-modal">{sheet}</div>
          </div>
        </div>
      </DesktopShell>
    );
  }
  return (
    <div className="bf-screen" style={{ background: 'rgba(23,26,74,0.55)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--cream)', opacity: 0.35, pointerEvents: 'none' }} />
      <div style={{ marginTop: 'auto', background: 'var(--cream)', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '14px 0 24px', boxShadow: '0 -16px 40px rgba(23,26,74,0.18)', position: 'relative', zIndex: 1 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--line-strong)', margin: '0 auto 12px' }} />
        {sheet}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 3 · DESKTOP SHELL HELPERS
// ════════════════════════════════════════════════════════════════════

function DesktopShell({ active, right, children }) {
  return (
    <div className="bf-desk">
      <DesktopRail active={active} />
      <main className="bf-main">
        <div className="bf-main-inner">{children}</div>
      </main>
      {right && <aside className="bf-side">{right}</aside>}
    </div>
  );
}

function PageHead({ eyebrow, step, title, children }) {
  return (
    <header className="bf-pagehead">
      {step && <div className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.22em' }}>{step}</div>}
      {eyebrow && <div className="bf-eyebrow">— {eyebrow}</div>}
      <h1 className="bf-page-h1">{title}</h1>
      {children}
    </header>
  );
}

function RequestSidebar({ step }) {
  const summary = [
    { label: 'Property', value: 'Plot 27B, Admiralty Way' },
    { label: 'Documents', value: '2 of 3 labelled' },
    { label: 'Tier', value: 'Premium · ₦150,000' },
  ];
  return (
    <div>
      <div className="bf-eyebrow slate" style={{ marginBottom: 14 }}>— Request summary</div>
      <div className="bf-stack" style={{ gap: 14 }}>
        {summary.map((s, i) => (
          <div key={s.label} className={`bf-summary-row ${i < step ? 'done' : i === step ? 'current' : ''}`}>
            <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>{s.label.toUpperCase()}</div>
            <div className="bf-body" style={{ fontSize: 14, marginTop: 2, color: i <= step ? 'var(--navy)' : 'var(--slate)' }}>{i <= step ? s.value : '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 4 · FRAMES — phone, tablet, desktop wrappers
// ════════════════════════════════════════════════════════════════════

function PhoneFrame({ children }) {
  return <IOSDevice width={402} height={874}>{children}</IOSDevice>;
}

// Plain iPad-style frame (rounded bezel, no real status bar — keeps focus on UI)
function TabletFrame({ width, height, children }) {
  return (
    <div style={{
      width, height, borderRadius: 36, overflow: 'hidden',
      background: 'var(--cream)',
      boxShadow: '0 30px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.10)',
      position: 'relative',
    }}>
      <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>{children}</div>
    </div>
  );
}

function DesktopFrame({ width = 1280, height = 820, children, url = 'verity.properties/buyer', tabs }) {
  const tabList = tabs || [{ title: 'Verity · Buyer', active: true }, { title: 'Lagos State Land Registry' }];
  return (
    <div style={{ width, borderRadius: 12, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.10)' }}>
      <ChromeWindow width={width} height={height} url={url} tabs={tabList} activeIndex={0}>
        <div style={{ width: '100%', height: '100%', overflow: 'auto', background: 'var(--cream)' }}>{children}</div>
      </ChromeWindow>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 5 · COMPOSITION — sections × screens × viewports
// ════════════════════════════════════════════════════════════════════

const SCREENS = [
  { id: 'signup',  Comp: ScreenSignup,            section: '02', stage: '02 · Account creation', label: 'Sign up' },
  { id: 'sent',    Comp: ScreenEmailSent,         section: '02', stage: '02 · Account creation', label: 'Email sent' },
  { id: 'req-1',   Comp: ScreenRequestProperty,   section: '03', stage: '03 · Request',          label: '1 · Property' },
  { id: 'req-2',   Comp: ScreenRequestDocs,       section: '03', stage: '03 · Request',          label: '2 · Documents' },
  { id: 'req-3',   Comp: ScreenRequestTier,       section: '03', stage: '03 · Request',          label: '3 · Tier' },
  { id: 'req-4',   Comp: ScreenRequestPayment,    section: '03', stage: '03 · Request',          label: '4 · Payment' },
  { id: 'req-5',   Comp: ScreenRequestConfirmed,  section: '03', stage: '03 · Request',          label: '5 · Confirmed' },
  { id: 'dash',    Comp: ScreenBuyerDashboard,    section: 'dash', stage: 'Dashboard',           label: 'Buyer dashboard' },
  { id: 'st-prog', Comp: ScreenStatusInProgress,  section: '04', stage: '04 · Status',           label: 'In progress' },
  { id: 'st-act',  Comp: ScreenStatusAwaiting,    section: '04', stage: '04 · Status',           label: 'Awaiting action' },
  { id: 'st-ok',   Comp: ScreenStatusComplete,    section: '04', stage: '04 · Status',           label: 'Completed' },
  { id: 'cert',    Comp: ScreenCertificate,       section: '05', stage: '05 · Certificate',      label: 'Certificate' },
  { id: 'share',   Comp: ScreenDistribute,        section: '06', stage: '06 · Distribute',       label: 'Share sheet' },
];

function FrameCard({ label, children, viewport }) {
  return (
    <figure className="bf-figure">
      <div>{children}</div>
      <figcaption>
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{viewport}</span>
        <span className="dot">·</span>
        <span className="bf-mono" style={{ fontSize: 10, color: 'var(--navy)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</span>
      </figcaption>
    </figure>
  );
}

function App() {
  // Group screens by stage
  const stages = [];
  const byStage = {};
  for (const s of SCREENS) {
    if (!byStage[s.stage]) { byStage[s.stage] = []; stages.push(s.stage); }
    byStage[s.stage].push(s);
  }

  return (
    <main className="bf-page">
      {stages.map(stage => (
        <section className="bf-stage-block" key={stage}>
          <header className="bf-stage-head">
            <h2>{stage}</h2>
          </header>

          {/* PHONE row */}
          <div className="bf-stage-row">
            <div className="bf-vp-label">Phone <span className="dim">402 × 874</span></div>
            <div className="bf-frames phone">
              {byStage[stage].map(s => (
                <FrameCard key={s.id} label={s.label} viewport="iOS">
                  <PhoneFrame><s.Comp vp="phone" /></PhoneFrame>
                </FrameCard>
              ))}
            </div>
          </div>

          {/* TABLET PORTRAIT row */}
          <div className="bf-stage-row">
            <div className="bf-vp-label">Tablet · portrait <span className="dim">834 × 1194</span></div>
            <div className="bf-frames tablet-p">
              {byStage[stage].map(s => (
                <FrameCard key={s.id} label={s.label} viewport="iPad · portrait">
                  <TabletFrame width={834} height={1100}><s.Comp vp="tablet-p" /></TabletFrame>
                </FrameCard>
              ))}
            </div>
          </div>

          {/* TABLET LANDSCAPE row */}
          <div className="bf-stage-row">
            <div className="bf-vp-label">Tablet · landscape <span className="dim">1194 × 834</span></div>
            <div className="bf-frames tablet-l">
              {byStage[stage].map(s => (
                <FrameCard key={s.id} label={s.label} viewport="iPad · landscape">
                  <TabletFrame width={1194} height={820}><s.Comp vp="tablet-l" /></TabletFrame>
                </FrameCard>
              ))}
            </div>
          </div>

          {/* DESKTOP row */}
          <div className="bf-stage-row">
            <div className="bf-vp-label">Desktop <span className="dim">1280 × 820</span></div>
            <div className="bf-frames desktop">
              {byStage[stage].map(s => (
                <FrameCard key={s.id} label={s.label} viewport="Desktop · web">
                  <DesktopFrame><s.Comp vp="desktop" /></DesktopFrame>
                </FrameCard>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
