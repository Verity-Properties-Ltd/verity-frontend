/* global React, DvmAppBar, DvmTabletRail, DvmBottomTabs, DvmPageBar, VP, Ico, DvmBandPill */
// VERITY · Portfolio — mobile + tablet
// + Empty state (Founding 50 welcome)

const PORTFOLIO_ROWS = [
  { name: 'Lekki Block A · Unit 14B', vpid: 'VRT-LA-2025-0184', band: 'gold', status: 'active', updated: '2h ago', addr: 'Lekki Phase 1 · Plot 12' },
  { name: 'VI Court Heights · 3A', vpid: 'VRT-LA-2025-0162', band: 'platinum', status: 'active', updated: 'Yesterday', addr: 'Victoria Island · 19 Kofo' },
  { name: 'Ikoyi Garden · 7', vpid: 'VRT-LA-2025-0177', band: 'silver', status: 'verifying', updated: '3 days', addr: 'Ikoyi · 4 Bourdillon Road' },
  { name: 'Lekki Block C · 22A', vpid: 'VRT-LA-2025-0149', band: 'gold', status: 'expired', updated: 'Expires 14d', addr: 'Lekki Phase 1 · Plot 26', warn: true },
  { name: 'Banana Island Villa 06', vpid: 'VRT-LA-2025-0142', band: 'platinum', status: 'active', updated: '5 days', addr: 'Banana Island · 6 Esther' },
  { name: 'Lekki Block B · 9C', vpid: 'VRT-LA-2025-0188', band: 'bronze', status: 'refresh', updated: '6 days', addr: 'Lekki Phase 1 · Plot 18' },
  { name: 'Oniru Terrace · Unit 4', vpid: 'VRT-LA-2025-0151', band: 'silver', status: 'active', updated: '8 days', addr: 'Oniru · 12 Akin Adesola' },
  { name: 'Lekki Block A · Unit 03', vpid: 'VRT-LA-2025-0166', band: 'gold', status: 'active', updated: '11 days', addr: 'Lekki Phase 1 · Plot 12' },
  { name: 'Parkview Estate · Block F', vpid: 'VRT-LA-2025-0119', band: 'prov', status: 'verifying', updated: '12 days', addr: 'Parkview · F-04' },
  { name: 'Lekki Block A · Unit 21', vpid: 'VRT-LA-2025-0123', band: 'gold', status: 'active', updated: '14 days', addr: 'Lekki Phase 1 · Plot 12' },
];

function DvmPortfolio({ vp }) {
  const isPhone = VP.isPhone(vp);
  const isLandscape = VP.isLandscape(vp);
  const showTable = isLandscape; // dense table on landscape only

  return (
    <div className={`dvm ${vp}`}>
      {isPhone ? (
        <>
          <DvmAppBar vp={vp} />
          <DvmPageBar
            eyebrow="04.5 · Portfolio · 87 titles"
            title="Your <em>portfolio.</em>"
            right={<button className="back" style={{ width: 36, height: 36 }}>{Ico.filter}</button>}
          />
          <PortfolioBody vp={vp} showTable={false} />
          <DvmBottomTabs active="portfolio" />
        </>
      ) : (
        <div className="dvm-railed">
          <DvmTabletRail vp={vp} active="portfolio" />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <DvmAppBar vp={vp} />
            <DvmPageBar
              eyebrow="04.5 · Portfolio · 87 titles"
              title="Your <em>portfolio.</em>"
              right={(
                <>
                  <button type="button" className="dvm-btn outline sm row" style={{ height: 36 }}>
                    {Ico.download} <span>Export CSV</span>
                  </button>
                  <button type="button" className="dvm-btn sm row" style={{ height: 36 }}>
                    {Ico.plus} <span>Add property</span>
                  </button>
                </>
              )}
            />
            <PortfolioBody vp={vp} showTable={showTable} />
          </div>
        </div>
      )}
    </div>
  );
}

function PortfolioBody({ vp, showTable }) {
  return (
    <div className="dvm-body pad" style={{ paddingBottom: VP.isPhone(vp) ? 100 : 32 }}>
      {/* Search + chips */}
      <div className="dvm-search">
        <span className="ic">{Ico.search}</span>
        <input type="text" placeholder="Search address, VPID, or owner name…" />
      </div>
      <div className="dvm-chips">
        <span className="dvm-chip active">All <span className="ct">87</span></span>
        <span className="dvm-chip">Active <span className="ct">73</span></span>
        <span className="dvm-chip">Verifying <span className="ct">6</span></span>
        <span className="dvm-chip">Expiring <span className="ct">2</span></span>
        <span className="dvm-chip">Platinum <span className="ct">7</span></span>
        <span className="dvm-chip">Gold <span className="ct">30</span></span>
        <span className="dvm-chip">Silver <span className="ct">24</span></span>
      </div>

      {/* Bulk bar */}
      <div className="dvm-bulkbar">
        <span className="ct">12 selected</span>
        <span style={{
          fontFamily: 'var(--f-meta)', fontSize: 11, color: 'rgba(245,242,237,0.7)',
          letterSpacing: '0.14em',
        }}>of 87</span>
        <div className="actions">
          <span className="ba">Distribute</span>
          {!VP.isPhone(vp) && <span className="ba">Renew</span>}
          <span className="ba">Export</span>
        </div>
      </div>

      {showTable ? <PortfolioTable /> : <PortfolioCards />}

      <div className="dvm-pager">
        <span>Showing 1–10 of 87</span>
        <div className="pages">
          <span className="pg">‹</span>
          <span className="pg active">1</span>
          <span className="pg">2</span>
          <span className="pg">3</span>
          <span className="pg">…</span>
          <span className="pg">9</span>
          <span className="pg">›</span>
        </div>
      </div>
    </div>
  );
}

function PortfolioCards() {
  return (
    <div>
      {PORTFOLIO_ROWS.map((r, i) => (
        <div className="dvm-prop-row" key={r.vpid}>
          <div className="check" style={{ display: 'none' }}></div>
          <div>
            <div className="name">{r.name}</div>
            <div className="meta">
              <span className="vpid">{r.vpid}</span>
              <span className="sep">·</span>
              <span>{r.addr}</span>
            </div>
          </div>
          <div className="right">
            <DvmBandPill band={r.band} />
            <span className={`date ${r.warn ? 'warn' : ''}`}>{r.updated}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PortfolioTable() {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--cream)' }}>
            <th style={thStyle} width="32"></th>
            <th style={thStyle}>Property</th>
            <th style={thStyle}>VPID</th>
            <th style={thStyle}>Band</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Updated</th>
            <th style={thStyle} width="32"></th>
          </tr>
        </thead>
        <tbody>
          {PORTFOLIO_ROWS.map((r, i) => (
            <tr key={r.vpid} style={{ borderTop: '1px solid var(--line)' }}>
              <td style={tdStyle}><span className="check" style={{
                width: 16, height: 16, borderRadius: 2, border: '1px solid var(--line-strong)',
                display: 'inline-block', background: i < 4 ? 'var(--navy)' : '#fff', position: 'relative',
              }}>{i < 4 && <span style={{
                position: 'absolute', left: 4, top: 1, width: 4, height: 9,
                borderRight: '2px solid var(--cream)', borderBottom: '2px solid var(--cream)',
                transform: 'rotate(45deg)',
              }}></span>}</span></td>
              <td style={tdStyle}>
                <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{r.name}</div>
                <div style={{
                  fontFamily: 'var(--f-meta)', fontSize: 10.5,
                  color: 'var(--slate)', letterSpacing: '0.10em', marginTop: 3,
                }}>{r.addr}</div>
              </td>
              <td style={{ ...tdStyle, fontFamily: 'var(--f-meta)', fontSize: 11, letterSpacing: '0.06em' }}>{r.vpid}</td>
              <td style={tdStyle}><DvmBandPill band={r.band} /></td>
              <td style={tdStyle}>
                <span style={{
                  fontFamily: 'var(--f-meta)', fontSize: 10,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: r.status === 'expired' ? 'var(--gold-deep)'
                    : r.status === 'verifying' ? 'var(--gold-deep)'
                    : r.status === 'refresh' ? '#5C6BC0' : 'var(--success)',
                }}>{r.status}</span>
              </td>
              <td style={{ ...tdStyle, fontFamily: 'var(--f-meta)', fontSize: 11, color: r.warn ? 'var(--gold-deep)' : 'var(--slate)' }}>{r.updated}</td>
              <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--slate)' }}>{Ico.more}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  fontFamily: 'var(--f-meta)', fontSize: 9,
  color: 'var(--slate)', letterSpacing: '0.20em',
  textTransform: 'uppercase', fontWeight: 400,
  padding: '12px 14px', borderBottom: '1px solid var(--line)',
};
const tdStyle = { padding: '14px 14px', verticalAlign: 'middle' };

// ─── Empty state (Founding 50 welcome) ──────────────────────────
function DvmPortfolioEmpty({ vp }) {
  const isPhone = VP.isPhone(vp);
  return (
    <div className={`dvm ${vp}`}>
      {isPhone ? (
        <>
          <DvmAppBar vp={vp} />
          <DvmPageBar eyebrow="04.5 · Portfolio · 0 titles" title="Your <em>portfolio.</em>" />
          <EmptyBody vp={vp} />
          <DvmBottomTabs active="portfolio" />
        </>
      ) : (
        <div className="dvm-railed">
          <DvmTabletRail vp={vp} active="portfolio" />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <DvmAppBar vp={vp} />
            <DvmPageBar eyebrow="04.5 · Portfolio · 0 titles" title="Your <em>portfolio.</em>" />
            <EmptyBody vp={vp} />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyBody({ vp }) {
  return (
    <div className="dvm-body pad" style={{ paddingBottom: VP.isPhone(vp) ? 100 : 32 }}>
      <div className="dvm-empty">
        <div className="eyebrow">Founding 50 · Cohort 014</div>
        <h2>Welcome to <em>Verity,</em> Lekki Heights.</h2>
        <p>
          Your workspace is ready. Add your first title to begin issuing verified
          certificates — Verity records the chain of evidence behind every property
          you sell.
        </p>
        <div className="stages">
          <div className="stage">
            <div className="num">01</div>
            <div>
              <div className="h">Submit your first title</div>
              <div className="sub">Address, RC number, scanned title documents. Three to four minutes per property.</div>
            </div>
          </div>
          <div className="stage">
            <div className="num">02</div>
            <div>
              <div className="h">We verify against registry</div>
              <div className="sub">Lagos State Land Registry · Family land records · Court search.</div>
            </div>
          </div>
          <div className="stage">
            <div className="num">03</div>
            <div>
              <div className="h">Distribute your certificates</div>
              <div className="sub">URL, PDF, embed widget, QR code, partner badge.</div>
            </div>
          </div>
        </div>
        <div className="actions">
          <button type="button" className="dvm-btn">
            <span>Add your first property</span><span className="arrow">→</span>
          </button>
          <button type="button" className="dvm-btn outline">
            <span>Bulk upload via CSV</span>
          </button>
        </div>
      </div>

      <div className="dvm-trust-note" style={{ marginTop: 18 }}>
        <div className="label">Founding 50 benefit · Cohort 014</div>
        <div className="body">
          Your first 50 issuances are <em>complimentary.</em> Founding partners also receive priority verification within 4 hours, and direct support from the Verity onboarding team.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DvmPortfolio, DvmPortfolioEmpty });
