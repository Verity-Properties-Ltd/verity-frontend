/* global React, DvmShell, VP, Ico */
// VERITY · Developer dashboard landing — mobile + tablet
// kyc_verified · returning developer (Adebola O · Lekki Heights)

function DvmDashboard({ vp }) {
  return (
    <div className={`dvm ${vp}`}>
      {VP.isPhone(vp) ? (
        <>
          <DvmAppBar vp={vp} />
          <DashboardBody vp={vp} />
          <DvmBottomTabs active="home" />
        </>
      ) : (
        <div className="dvm-railed">
          <DvmTabletRail vp={vp} active="home" />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <DvmAppBar vp={vp} />
            <DashboardBody vp={vp} />
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardBody({ vp }) {
  return (
    <div className="dvm-body pad" style={{ paddingBottom: VP.isPhone(vp) ? 100 : 32 }}>
      <div className="dvm-greeting">
        <div className="eyebrow">Welcome back · Tuesday, 19 May</div>
        <div className="h">Good morning, <em>Adebola.</em></div>
        <div className="sub">3 properties need your attention this week. Two certificates expire in the next 30 days.</div>
        <span className="verified">
          <span className="dot"></span>
          Company verified · KYC Tier 2
          <span style={{ paddingLeft: 8, marginLeft: 8, borderLeft: '1px solid rgba(79,143,79,0.32)', color: 'var(--slate)' }}>
            VRT-DEV-2026-0014
          </span>
        </span>
      </div>

      {/* KPIs */}
      <div className="dvm-kpi-grid">
        <div className="dvm-kpi-card">
          <div className="label">Portfolio</div>
          <div className="value">87<span className="unit">titles</span></div>
          <div className="delta up">+ 4 added this month</div>
        </div>
        <div className="dvm-kpi-card">
          <div className="label">Active certificates</div>
          <div className="value">73</div>
          <div className="delta">84% of portfolio</div>
        </div>
        <div className="dvm-kpi-card">
          <div className="label">Issuances · 30d</div>
          <div className="value">128</div>
          <div className="delta up">+ 22% vs last 30d</div>
        </div>
        <div className="dvm-kpi-card">
          <div className="label">Attention</div>
          <div className="value" style={{ color: 'var(--gold-deep)' }}>3</div>
          <div className="delta">Expiring · documents</div>
        </div>
      </div>

      {/* Attention */}
      <div className="dvm-secthead">
        <h3>Needs your attention</h3>
        <span className="more">View all</span>
      </div>
      <div className="dvm-attn-card">
        <div className="dvm-attn-item warn">
          <span className="pad">{Ico.warn}</span>
          <div>
            <div className="h">2 certificates expire in <em>under 30 days</em></div>
            <div className="sub">Lekki Block A · Lekki Block C</div>
          </div>
          <span className="arrow">→</span>
        </div>
        <div className="dvm-attn-item upgrade">
          <span className="pad" style={{ color: '#5C6BC0' }}>{Ico.shield}</span>
          <div>
            <div className="h">Lekki Block A is eligible for <em>Platinum upgrade</em></div>
            <div className="sub">Survey + court search · Mono Tier 3</div>
          </div>
          <span className="arrow">→</span>
        </div>
        <div className="dvm-attn-item">
          <span className="pad">{Ico.doc}</span>
          <div>
            <div className="h">Court search expired · <em>VI Court Heights</em></div>
            <div className="sub">Renew within 14 days</div>
          </div>
          <span className="arrow">→</span>
        </div>
      </div>

      {/* Confidence breakdown */}
      <div className="dvm-secthead">
        <h3>Confidence breakdown</h3>
        <span className="meta">87 total</span>
      </div>
      <div className="dvm-band-card">
        <div className="total">Distribution across <em>six</em> confidence bands</div>
        <div className="dvm-band-bar">
          <div className="seg platinum" style={{ width: '8%' }}>7</div>
          <div className="seg gold" style={{ width: '34%' }}>30</div>
          <div className="seg silver" style={{ width: '28%' }}>24</div>
          <div className="seg bronze" style={{ width: '13%' }}>12</div>
          <div className="seg prov" style={{ width: '11%' }}>10</div>
          <div className="seg unconf" style={{ width: '6%' }}>4</div>
        </div>
        <div className="dvm-band-legend">
          <div className="row"><span className="dot" style={{ background: '#5C6BC0' }}></span><span className="name">Platinum</span> 7</div>
          <div className="row"><span className="dot" style={{ background: 'var(--gold)' }}></span><span className="name">Gold</span> 30</div>
          <div className="row"><span className="dot" style={{ background: '#9598A0' }}></span><span className="name">Silver</span> 24</div>
          <div className="row"><span className="dot" style={{ background: '#B07A4A' }}></span><span className="name">Bronze</span> 12</div>
          <div className="row"><span className="dot" style={{ background: '#C8C0AE' }}></span><span className="name">Provisional</span> 10</div>
          <div className="row"><span className="dot" style={{ background: '#E6E0D2' }}></span><span className="name">Unconfirmed</span> 4</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="dvm-secthead">
        <h3>Quick actions</h3>
      </div>
      <div className={`dvm-quick ${VP.isPhone(vp) ? 'phone' : ''}`}>
        <div className="dvm-quick-card primary">
          <div className="label">Add a property</div>
          <div className="h">New <em>title</em> submission</div>
          <div className="sub">Single, batch, or CSV up to 500 rows.</div>
          <span className="arrow">→</span>
        </div>
        <div className="dvm-quick-card">
          <div className="label">Distribute</div>
          <div className="h">Share <em>certificate</em></div>
          <div className="sub">Five formats — URL, PDF, embed, QR, badge.</div>
          <span className="arrow">→</span>
        </div>
        <div className="dvm-quick-card">
          <div className="label">Renew</div>
          <div className="h">Bulk renewal</div>
          <div className="sub">2 expiring certificates · ₦ 18,400 estimated.</div>
          <span className="arrow">→</span>
        </div>
      </div>

      {/* Activity */}
      <div className="dvm-secthead">
        <h3>Recent activity</h3>
        <span className="more">Last 7 days</span>
      </div>
      <div className="dvm-feed">
        <div className="dvm-feed-item">
          <div className="when">2h ago</div>
          <div className="what">Certificate <em>issued</em> · Lekki Block A · Unit 14B<span className="vpid">VRT-LA-2025-0184</span></div>
        </div>
        <div className="dvm-feed-item">
          <div className="when">Yesterday</div>
          <div className="what">Confidence band <em>upgraded</em> to Gold · VI Court Heights<span className="vpid">VRT-LA-2025-0162</span></div>
        </div>
        <div className="dvm-feed-item">
          <div className="when">2 days</div>
          <div className="what">3 certificates <em>distributed</em> via embed widget</div>
        </div>
        <div className="dvm-feed-item">
          <div className="when">3 days</div>
          <div className="what">Court search uploaded · Ikoyi Garden · awaiting review<span className="vpid">VRT-LA-2025-0177</span></div>
        </div>
        <div className="dvm-feed-item">
          <div className="when">5 days</div>
          <div className="what">2 new properties added via CSV import · 18 rows total</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DvmDashboard });
