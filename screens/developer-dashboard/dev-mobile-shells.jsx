/* global React, IOSDevice */
// Shared mobile/tablet shells + device frames + nav components.
// Loaded after React + Babel + ios-frame.jsx.

const VP = {
  isPhone: vp => vp === 'phone',
  isTablet: vp => vp === 'tp' || vp === 'tl',
  isPortrait: vp => vp === 'tp',
  isLandscape: vp => vp === 'tl',
};

// ─────────────────────────────────────────────────────────────
// Device frames
// ─────────────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return <IOSDevice width={402} height={874}>{children}</IOSDevice>;
}

// Generic tablet bezel (used for iPad portrait + landscape)
function TabletFrame({ width, height, children }) {
  return (
    <div style={{
      width, height, borderRadius: 36, overflow: 'hidden',
      background: 'var(--cream)',
      boxShadow: '0 30px 70px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.10)',
      position: 'relative',
    }}>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inline SVG icons (small, monochrome) — kept here so individual
// screen files stay tight. currentColor-based.
// ─────────────────────────────────────────────────────────────
const Ico = {
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
  ),
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/></svg>
  ),
  portfolio: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="1.5"/><path d="M8 6V4h8v2"/><path d="M3 12h18"/></svg>
  ),
  plus: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
  ),
  activity: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
  ),
  distribute: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 11 6-4M9 13l6 4"/></svg>
  ),
  back: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6"/></svg>
  ),
  more: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
  ),
  copy: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/></svg>
  ),
  download: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/></svg>
  ),
  upload: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 16v4h14v-4"/></svg>
  ),
  filter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18M6 12h12M10 19h4"/></svg>
  ),
  lock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/><path d="m8.5 12 2.5 2.5L16 10"/></svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.6-3.6a4.5 4.5 0 0 0-6.4-6.4L12 5.6"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0L4 13.6a4.5 4.5 0 0 0 6.4 6.4L12 18.4"/></svg>
  ),
  pdf: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>
  ),
  qr: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M21 14v3M14 21h3M21 17v4"/></svg>
  ),
  code: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 6l-4 12"/></svg>
  ),
  badge: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6"/><path d="m9 14-1.5 7L12 18l4.5 3L15 14"/></svg>
  ),
  doc: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>
  ),
  warn: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4 2 20h20Z"/><path d="M12 10v5M12 18v.5"/></svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// AppBar — top bar inside in-app screens
// ─────────────────────────────────────────────────────────────
function DvmAppBar({ vp, role = 'Developer', notify = true, name = 'AO' }) {
  return (
    <div className="dvm-appbar">
      <div className="brand">
        <span className="word">VERITY</span>
        <span className="gold"></span>
        <span className="role">{role}</span>
      </div>
      <div className="actions">
        <button className="icon-btn" type="button">
          {Ico.bell}
          {notify && <span className="dot"></span>}
        </button>
        {VP.isTablet(vp) && (
          <button className="icon-btn" type="button">{Ico.search}</button>
        )}
        <div className="ava">{name}</div>
      </div>
    </div>
  );
}

// Page title row (back arrow + title, optional right slot)
function DvmPageBar({ back = true, eyebrow, title, right }) {
  return (
    <div className="dvm-pagebar">
      {back && <button className="back" type="button">{Ico.back}</button>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <div className="title-meta">{eyebrow}</div>}
        <h1 className="title" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {right && <div className="right">{right}</div>}
    </div>
  );
}

// Bottom tab bar — phone only
function DvmBottomTabs({ active = 'home' }) {
  const tabs = [
    { id: 'home', lbl: 'Home', ic: Ico.home },
    { id: 'portfolio', lbl: 'Portfolio', ic: Ico.portfolio },
    { id: 'add', lbl: 'Add', ic: Ico.plus, primary: true },
    { id: 'distribute', lbl: 'Share', ic: Ico.distribute },
    { id: 'account', lbl: 'Account', ic: Ico.user },
  ];
  return (
    <div className="dvm-bottom">
      {tabs.map(t => (
        <div key={t.id} className={`dvm-tab ${t.primary ? 'add' : ''} ${active === t.id ? 'active' : ''}`}>
          <span className="ic">{t.ic}</span>
          <span className="lbl">{t.lbl}</span>
        </div>
      ))}
    </div>
  );
}

// Tablet side rail
function DvmTabletRail({ vp, active = 'home', kycVerified = true }) {
  const items = [
    { id: 'home', lbl: 'Dashboard', ic: Ico.home },
    { id: 'portfolio', lbl: 'Portfolio', ic: Ico.portfolio, count: 87 },
    { id: 'add', lbl: 'Add property', ic: Ico.plus },
    { id: 'distribute', lbl: 'Distribute', ic: Ico.distribute },
    { id: 'activity', lbl: 'Activity', ic: Ico.activity, badge: '3' },
  ];
  const sec = [
    { id: 'account', lbl: 'Account', ic: Ico.user },
  ];
  return (
    <div className="dvm-rail">
      <div className="brand">
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 24, height: 24, borderRadius: 999, background: 'var(--gold)',
          color: 'var(--navy)', fontFamily: 'var(--f-display)', fontSize: 13,
          fontStyle: 'italic', fontWeight: 500,
        }}>V</span>
        <span className="word">VERITY</span>
      </div>
      <div className="group-label">Main</div>
      <div className="nav">
        {items.map(it => (
          <div key={it.id} className={`nav-item ${active === it.id ? 'active' : ''}`}>
            <span className="ic">{it.ic}</span>
            <span className="label">{it.lbl}</span>
            {it.badge && <span className="badge">{it.badge}</span>}
            {it.count != null && !it.badge && <span className="count">{it.count}</span>}
          </div>
        ))}
      </div>
      <div className="group-label">Settings</div>
      <div className="nav">
        {sec.map(it => (
          <div key={it.id} className={`nav-item ${active === it.id ? 'active' : ''}`}>
            <span className="ic">{it.ic}</span>
            <span className="label">{it.lbl}</span>
          </div>
        ))}
      </div>
      <div className="rail-foot">
        <div className="rail-user">
          <span className="ava">AO</span>
          <div className="who">
            <div className="name">Adebola O.</div>
            <div className="role">Owner · Lekki Heights</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Full in-app shell with tabs/rail by viewport.
// Children render inside the body scroll area.
function DvmShell({ vp, page, eyebrow, title, right, active, children, kycVerified = true, withTabs = true, withPageBar = true, bodyClass = 'pad' }) {
  const inner = (
    <>
      <DvmAppBar vp={vp} />
      {withPageBar && <DvmPageBar eyebrow={eyebrow} title={title} right={right} />}
      <div className={`dvm-body ${bodyClass}`}>
        {children}
      </div>
      {VP.isPhone(vp) && withTabs && <DvmBottomTabs active={active} />}
    </>
  );

  if (VP.isPhone(vp)) {
    return <div className={`dvm phone`}>{inner}</div>;
  }
  // tablet — rail + main column
  return (
    <div className={`dvm ${vp}`}>
      <div className="dvm-railed">
        <DvmTabletRail vp={vp} active={active} kycVerified={kycVerified} />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {inner}
        </div>
      </div>
    </div>
  );
}

// Auth-flavored shell (no rail/tabs) — used for signup, verification, invalid invite
function DvmAuthShell({ vp, children, withInvite = true }) {
  return (
    <div className={`dvm ${vp}`}>
      <div className="dvm-auth">
        <div className="dvm-auth-brand">
          <span className="word">VERITY</span>
          {withInvite && (
            <span className="invited">
              <span className="gold"></span> Founding 50 · Invited
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

// Confidence band pill — small reusable
function DvmBandPill({ band }) {
  const map = {
    platinum: 'Platinum',
    gold: 'Gold',
    silver: 'Silver',
    bronze: 'Bronze',
    prov: 'Provisional',
    unconf: 'Unconfirmed',
  };
  return (
    <span className={`band ${band}`}>
      <span className="dot"></span>
      {map[band]}
    </span>
  );
}

Object.assign(window, {
  VP, Ico,
  PhoneFrame, TabletFrame,
  DvmAppBar, DvmPageBar, DvmBottomTabs, DvmTabletRail,
  DvmShell, DvmAuthShell, DvmBandPill,
});
