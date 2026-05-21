/* VERITY · Developer dashboard — landing surface (§4.2) */

function DevDashboard() {
  // Portfolio data — Lekki Heights Properties Ltd, 87 properties total.
  const totals = {
    total: 87,
    inVerification: 6,
    expiringSoon: 12,
    bands: { platinum: 8, gold: 41, silver: 22, bronze: 6, prov: 6, unconf: 4 },
  };

  // Render confidence band breakdown bar (% widths)
  const bandOrder = ['platinum','gold','silver','bronze','prov','unconf'];
  const bandTotal = bandOrder.reduce((s, k) => s + totals.bands[k], 0);

  return (
    <div className="dv-app">
      <DevRail active="dashboard"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Dashboard']}/>
        <div className="dv-content">

          <PageHead
            eyebrow={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span>Tuesday · 12 May 2026 · 09:14 WAT</span>
                <span className="dv-verified-strip">
                  <span className="dot"></span>
                  Company verified
                  <span className="ref">Mono · 09 May 2026</span>
                </span>
              </span>
            }
            title='Good morning, <em>Adeola</em>.'
            lede="Six properties are mid-verification. Twelve verifications expire in the next ninety days — a quiet quarter so far."
            actions={[
              <button key="a" className="dv-btn outline">View activity</button>,
              <button key="b" className="dv-btn primary">Add a property <span className="arrow">→</span></button>,
            ]}
          />

          {/* KPI strip */}
          <div className="dv-kpi-grid">
            <div className="dv-kpi">
              <div className="label">Portfolio · total</div>
              <div className="value">87</div>
              <div className="delta up">+ 4 added this quarter</div>
            </div>
            <div className="dv-kpi">
              <div className="label">In verification</div>
              <div className="value">6</div>
              <div className="delta">3 awaiting docs · 3 in field</div>
            </div>
            <div className="dv-kpi">
              <div className="label">Expiring · 90 days</div>
              <div className="value">12</div>
              <div className="delta warn">Refresh available</div>
            </div>
            <div className="dv-kpi">
              <div className="label">Distribution · MTD</div>
              <div className="value">1,284 <span className="unit">views</span></div>
              <div className="delta up">+ 18% on April</div>
            </div>
          </div>

          {/* Two-column blocks: portfolio summary + attention */}
          <div className="dv-blocks">
            {/* BLOCK 1 — Portfolio summary */}
            <div className="dv-block">
              <div className="dv-block-head">
                <h3>Confidence band breakdown</h3>
                <span className="meta">87 properties · refreshed 06:00 WAT</span>
              </div>

              <div className="dv-band-bar" role="img" aria-label="Confidence band distribution">
                {bandOrder.map(k => {
                  const ct = totals.bands[k];
                  const pct = (ct / bandTotal) * 100;
                  return (
                    <div key={k} className={`seg ${k}`} style={{ width: `${pct}%` }}>
                      {pct >= 8 ? ct : ''}
                    </div>
                  );
                })}
              </div>

              <div className="dv-band-legend">
                <div className="row">
                  <span className="dot" style={{background:'#5C6BC0'}}></span>
                  <span className="name">Platinum</span><span className="ct">8</span>
                </div>
                <div className="row">
                  <span className="dot" style={{background:'var(--gold)'}}></span>
                  <span className="name">Gold</span><span className="ct">41</span>
                </div>
                <div className="row">
                  <span className="dot" style={{background:'#9598A0'}}></span>
                  <span className="name">Silver</span><span className="ct">22</span>
                </div>
                <div className="row">
                  <span className="dot" style={{background:'#B07A4A'}}></span>
                  <span className="name">Bronze</span><span className="ct">6</span>
                </div>
                <div className="row">
                  <span className="dot" style={{background:'#C8C0AE'}}></span>
                  <span className="name">Provisional</span><span className="ct">6</span>
                </div>
                <div className="row">
                  <span className="dot" style={{background:'var(--slate-soft)'}}></span>
                  <span className="name">Unconfirmed</span><span className="ct">4</span>
                </div>
              </div>

              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                <div className="dv-block-head" style={{ borderBottom: 'none', marginBottom: 12, paddingBottom: 0 }}>
                  <h3 style={{ fontSize: 12 }}>Distribution · last 30 days</h3>
                  <span className="meta">verity.properties/v/* · public views</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
                  {[28,32,24,40,36,52,44,38,46,58,42,50,56,62,48,54,68,74,60,66,82,76,84,72,78,88,94,86,92,98].map((v, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: `${v}%`,
                      background: i >= 22 ? 'var(--gold)' : 'var(--gold-soft)',
                      borderRadius: '1px 1px 0 0',
                    }}></div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  <span>13 Apr</span><span>27 Apr</span><span>11 May</span>
                </div>
              </div>
            </div>

            {/* BLOCK 2 — Attention items */}
            <div className="dv-block">
              <div className="dv-block-head">
                <h3>Needs your attention</h3>
                <span className="meta">3 items</span>
              </div>

              <div className="dv-attn">
                <a className="dv-attn-item warn" href="#">
                  <div className="icon-pad">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v6m0 2.5v.5" stroke="#A88A45" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="8" cy="8" r="6.5" stroke="#A88A45" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="body">
                    <div className="h"><em>3 properties</em> need additional documents</div>
                    <div className="sub">Survey plans · CofO copies · Awaiting upload</div>
                  </div>
                  <span className="arrow">→</span>
                </a>

                <a className="dv-attn-item warn" href="#">
                  <div className="icon-pad">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6.5" stroke="#A88A45" strokeWidth="1.2"/>
                      <path d="M8 4.5V8l2.2 1.4" stroke="#A88A45" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="body">
                    <div className="h"><em>12 verifications</em> expire within 90 days</div>
                    <div className="sub">Refresh window open · Free for Founding 50</div>
                  </div>
                  <span className="arrow">→</span>
                </a>

                <a className="dv-attn-item upgrade" href="#">
                  <div className="icon-pad">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 12V4M5 7l3-3 3 3" stroke="#5C6BC0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="body">
                    <div className="h"><em>2 properties</em> have new evidence — band upgrade available</div>
                    <div className="sub">Court-cleared litigation · Silver → Gold candidates</div>
                  </div>
                  <span className="arrow">→</span>
                </a>
              </div>
            </div>

            {/* BLOCK 3 — Recent activity (full width) */}
            <div className="dv-block full">
              <div className="dv-block-head">
                <h3>Recent activity · last 7 days</h3>
                <span className="meta"><a href="#" style={{color:'var(--slate)', borderBottom:'1px solid var(--line)', paddingBottom:1, textDecoration:'none'}}>View all activity →</a></span>
              </div>

              <div className="dv-feed">
                <div className="dv-feed-item">
                  <span className="when">12 May · 08:42</span>
                  <span className="what">
                    Verification refreshed · <em>Lekki Block A · Plot 12</em>
                    <span className="vpid">VRT-LA-2025-0184</span>
                  </span>
                  <BandPill band="gold"/>
                </div>
                <div className="dv-feed-item">
                  <span className="when">11 May · 16:08</span>
                  <span className="what">
                    Band upgraded · <em>Ikoyi Foreshore · Unit 7B</em>
                    <span className="vpid">VRT-LA-2025-0151</span>
                    — Silver → Gold
                  </span>
                  <BandPill band="gold"/>
                </div>
                <div className="dv-feed-item">
                  <span className="when">11 May · 11:20</span>
                  <span className="what">
                    Certificate issued · <em>Victoria Island Tower II · Floor 14</em>
                    <span className="vpid">VRT-LA-2025-0207</span>
                  </span>
                  <BandPill band="platinum"/>
                </div>
                <div className="dv-feed-item">
                  <span className="when">10 May · 14:55</span>
                  <span className="what">
                    Team member added · <em>Tobi Adesina</em> — role: Editor
                  </span>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.14em'}}>+ MEMBER</span>
                </div>
                <div className="dv-feed-item">
                  <span className="when">09 May · 09:31</span>
                  <span className="what">
                    Verification submitted · <em>Banana Island · Villa 3</em>
                    <span className="vpid">VRT-LA-2025-0212</span>
                  </span>
                  <BandPill band="prov"/>
                </div>
                <div className="dv-feed-item">
                  <span className="when">07 May · 17:02</span>
                  <span className="what">
                    Verification expired · <em>Surulere Block C · Plot 4</em>
                    <span className="vpid">VRT-LA-2024-0089</span>
                    — refresh available
                  </span>
                  <BandPill band="unconf"/>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 4 — Quick actions */}
          <div className="dv-quick">
            <div className="dv-quick-card primary">
              <span className="label">Primary action</span>
              <div className="h">Add a <em>property</em></div>
              <div className="sub">Submit one or up to 25 in a batch.</div>
              <span className="arrow">→</span>
            </div>
            <div className="dv-quick-card">
              <span className="label">Distribute</span>
              <div className="h">Get <em>certificate</em> URLs &amp; embeds</div>
              <div className="sub">For your website, sales decks, on-site signage.</div>
              <span className="arrow">→</span>
            </div>
            <div className="dv-quick-card">
              <span className="label">Portfolio</span>
              <div className="h">View <em>full</em> portfolio</div>
              <div className="sub">Filter, sort, and bulk-manage 87 properties.</div>
              <span className="arrow">→</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

window.DevDashboard = DevDashboard;
