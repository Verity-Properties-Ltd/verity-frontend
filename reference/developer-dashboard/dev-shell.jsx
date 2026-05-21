/* VERITY · Developer dashboard — shell + shared components.
   Reusable across all developer screens. */

/* ─── Shared: confidence band pill ──────────────────────────── */
const BAND_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  prov: 'Provisional',
  unconf: 'Unconfirmed',
};

function BandPill({ band, size }) {
  return (
    <span className={`dv-band-pill ${band}${size === 'sm' ? ' sm' : ''}`}>
      <span className="dot"></span>{BAND_LABELS[band]}
    </span>
  );
}

/* ─── Shared: VERITY mark + lockup ──────────────────────────── */
/* Cream variant of the brand mark — navy is replaced with cream so it sits
   on dark surfaces. Geometry matches /verity-brand/logos/verity-mark.svg. */
function VerityMarkCream({ size = 22 }) {
  const w = size * 44 / 50;
  return (
    <svg viewBox="0 0 44 50" width={w} height={size} style={{ flexShrink: 0 }}>
      <path d="M 4 0 L 40 0 Q 44 0 44 4 L 44 34 Q 44 37 41.5 38.5 L 24.5 48.3 Q 22 49.7 19.5 48.3 L 2.5 38.5 Q 0 37 0 34 L 0 4 Q 0 0 4 0 Z" fill="#F5F2ED"/>
      <path d="M 30 7 L 37 7 L 37 14" stroke="#C9A961" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Shared: Left rail navigation ──────────────────────────── */
function DevRail({ active = 'dashboard' }) {
  const items = [
    { key: 'dashboard',  label: 'Dashboard',     icon: '◇',  href: '#'  },
    { key: 'portfolio',  label: 'Portfolio',     icon: '▤',  href: '#', count: '87' },
    { key: 'add',        label: 'Add property',  icon: '+',  href: '#'  },
    { key: 'distribute', label: 'Distribute',    icon: '↗',  href: '#'  },
  ];
  const items2 = [
    { key: 'team',     label: 'Team',     icon: '◯' },
    { key: 'billing',  label: 'Billing',  icon: '$' },
    { key: 'account',  label: 'Account',  icon: '▦', active: active === 'account' },
  ];
  return (
    <aside className="dv-rail">
      <div className="brand">
        <VerityMarkCream size={28}/>
        <div>
          <div className="word">VERITY</div>
          <div className="meta">Developer · Lagos</div>
        </div>
      </div>

      <div className="group-label">Workspace</div>
      <nav className="nav">
        {items.map(it => (
          <a key={it.key} className={`nav-item ${active === it.key ? 'active' : ''}`} href={it.href}>
            <span className="ic">{it.icon}</span>
            <span>{it.label}</span>
            {it.count ? <span className="count">{it.count}</span> : null}
          </a>
        ))}
      </nav>

      <div className="group-label">Account</div>
      <nav className="nav">
        {items2.map(it => (
          <a key={it.key} className={`nav-item ${active === it.key ? 'active' : ''}`} href="#">
            <span className="ic">{it.icon}</span>
            <span>{it.label}</span>
          </a>
        ))}
      </nav>

      <div className="rail-foot">
        <div className="rail-user">
          <div className="ava">AO</div>
          <div className="who">
            <div className="name">Adeola Ogundipe</div>
            <div className="role">Founding 50 · Cohort 014</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Shared: Top bar with crumbs ───────────────────────────── */
function DevTopbar({ crumbs = [], showSearch = true }) {
  return (
    <div className="dv-topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? 'here' : ''}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="controls">
        {showSearch && (
          <div className="search">
            <span className="ic">⌕</span>
            <input placeholder="Search properties, VPIDs, or addresses…"/>
          </div>
        )}
        <button className="icon-btn" style={{position:'relative'}} title="Notifications">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 6.5a5 5 0 0110 0V10l1 1.5H2L3 10V6.5zM6 13a2 2 0 004 0" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <span className="dot"></span>
        </button>
        <button className="icon-btn" title="Help">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6.5 6.2a1.5 1.5 0 113 .3c0 1-1.5 1.2-1.5 2.2M8 11.3v.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Shared: page heading ──────────────────────────────────── */
function PageHead({ eyebrow, title, lede, actions }) {
  return (
    <div className="dv-pagehead">
      <div className="row">
        <div>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
          {lede && <div className="lede">{lede}</div>}
        </div>
        {actions && <div className="actions">{actions}</div>}
      </div>
    </div>
  );
}

/* ─── Shared: stage block (figure caption + frame) ──────────── */
function StageBlock({ id, num, title, desc, children }) {
  return (
    <section className="dv-stage-block" id={id} data-screen-label={`${num} ${title}`}>
      <header className="dv-stage-head">
        <span className="num">{num}</span>
        <h2>{title}</h2>
        {desc && <span className="desc">{desc}</span>}
      </header>
      {children}
    </section>
  );
}

/* ─── Shared: figure (browser-window wrapper + caption) ─────── */
function DevFigure({ caption, dim, num, children }) {
  return (
    <figure className="dv-figure">
      {children}
      <figcaption>
        <span className="num">{num}</span>
        <span>{caption}</span>
        {dim && <span className="dim">· {dim}</span>}
      </figcaption>
    </figure>
  );
}

/* Export to window for cross-script access */
Object.assign(window, {
  BandPill, BAND_LABELS, VerityMarkCream,
  DevRail, DevTopbar, PageHead, StageBlock, DevFigure,
});
