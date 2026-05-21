/* VERITY · Developer dashboard — Portfolio (§4.3) + Empty state */

const PORTFOLIO_ROWS = [
  { sel: true,  name: 'Lekki Block A · Plot 12',           ref: 'LKI-A-12',    vpid: 'VRT-LA-2025-0184', band: 'gold',     verified: '12 May 2026', expiry: '12 May 2027', expiryWarn: false, status: 'active' },
  { sel: true,  name: 'Ikoyi Foreshore · Unit 7B',         ref: 'IKY-FS-07B',  vpid: 'VRT-LA-2025-0151', band: 'gold',     verified: '11 May 2026', expiry: '11 May 2027', expiryWarn: false, status: 'active' },
  { sel: false, name: 'Victoria Island Tower II · Fl. 14', ref: 'VI-T2-14',    vpid: 'VRT-LA-2025-0207', band: 'platinum', verified: '11 May 2026', expiry: '11 May 2028', expiryWarn: false, status: 'active' },
  { sel: false, name: 'Banana Island · Villa 3',           ref: 'BNI-V03',     vpid: 'VRT-LA-2025-0212', band: 'prov',     verified: '—',           expiry: '—',           expiryWarn: false, status: 'verifying' },
  { sel: false, name: 'Lekki Block B · Plot 04',           ref: 'LKI-B-04',    vpid: 'VRT-LA-2024-0312', band: 'silver',   verified: '02 Apr 2026', expiry: '02 Apr 2027', expiryWarn: false, status: 'active' },
  { sel: false, name: 'Surulere Block C · Plot 04',        ref: 'SUR-C-04',    vpid: 'VRT-LA-2024-0089', band: 'unconf',   verified: '07 May 2024', expiry: '07 May 2026', expiryWarn: true,  status: 'expired' },
  { sel: true,  name: 'Yaba Heights · Unit 22',            ref: 'YBH-22',      vpid: 'VRT-LA-2025-0099', band: 'gold',     verified: '14 Jan 2026', expiry: '14 Jul 2026', expiryWarn: true,  status: 'refresh' },
  { sel: false, name: 'Ajah Garden Estate · Plot 31',      ref: 'AJG-31',      vpid: 'VRT-LA-2025-0143', band: 'silver',   verified: '08 Mar 2026', expiry: '08 Mar 2027', expiryWarn: false, status: 'active' },
  { sel: false, name: 'Magodo Phase II · Plot 18',         ref: 'MGD-2-18',    vpid: 'VRT-LA-2025-0162', band: 'gold',     verified: '22 Mar 2026', expiry: '22 Mar 2027', expiryWarn: false, status: 'active' },
  { sel: false, name: 'Ikeja GRA · House 9',               ref: 'IKJ-GRA-9',   vpid: 'VRT-LA-2025-0188', band: 'platinum', verified: '01 May 2026', expiry: '01 May 2028', expiryWarn: false, status: 'active' },
  { sel: false, name: 'Oniru Estate · Block D · Plot 7',   ref: 'ONI-D-07',    vpid: 'VRT-LA-2025-0201', band: 'bronze',   verified: '05 May 2026', expiry: '05 May 2027', expiryWarn: false, status: 'active' },
  { sel: false, name: 'Chevron Drive · Villa 11',          ref: 'CHV-V11',     vpid: 'VRT-LA-2025-0218', band: 'prov',     verified: '—',           expiry: '—',           expiryWarn: false, status: 'verifying' },
];

function STATUS_PILL(status) {
  const map = {
    active:    { label: 'Active',          cls: 'active' },
    verifying: { label: 'In verification', cls: 'verifying' },
    expired:   { label: 'Expired',         cls: 'expired' },
    refresh:   { label: 'Refresh available', cls: 'refresh' },
  };
  const s = map[status];
  return <span className={`dv-status-pill ${s.cls}`}><span className="dot"></span>{s.label}</span>;
}

function DevPortfolio() {
  const selectedCt = PORTFOLIO_ROWS.filter(r => r.sel).length;

  return (
    <div className="dv-app">
      <DevRail active="portfolio"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Portfolio']}/>
        <div className="dv-content">

          <PageHead
            eyebrow="87 properties · Lagos State"
            title='<em>Portfolio</em>'
            lede="Sort, filter, and refresh verifications across your entire holding. Bulk actions available on selection."
            actions={[
              <button key="a" className="dv-btn outline">Export CSV</button>,
              <button key="b" className="dv-btn primary">Add property <span className="arrow">→</span></button>,
            ]}
          />

          {/* Filter bar */}
          <div className="dv-filter-bar">
            <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.22em', textTransform:'uppercase', marginRight:8}}>Filter</span>
            <span className="dv-chip active">All <span className="ct">87</span></span>
            <span className="dv-chip">Band <span className="caret">▾</span></span>
            <span className="dv-chip">Status <span className="caret">▾</span></span>
            <span className="dv-chip">Type <span className="caret">▾</span></span>
            <span className="dv-chip">Last verified <span className="caret">▾</span></span>
            <span className="dv-chip">Expiry <span className="caret">▾</span></span>
            <span className="spacer"></span>
            <span className="dv-link">Save view</span>
          </div>

          {/* Bulk action bar */}
          <div style={{ marginTop: 18 }}>
            <div className="dv-bulkbar">
              <span className="ct">{selectedCt} SELECTED</span>
              <span style={{fontSize:13, color:'rgba(245,242,237,0.78)'}}>
                Apply an action to all selected properties.
              </span>
              <div className="actions">
                <span className="ba">⟲ Refresh</span>
                <span className="ba">↗ Distribute</span>
                <span className="ba">⤓ Export CSV</span>
                <span className="ba">⌫ Archive</span>
              </div>
            </div>

            <div className="dv-table-wrap">
              <table className="dv-table">
                <thead>
                  <tr>
                    <th style={{width:36}}><span className="dv-table check"></span></th>
                    <th>Property <span className="sort">↕</span></th>
                    <th>VPID</th>
                    <th>Band</th>
                    <th>Last verified <span className="sort">↕</span></th>
                    <th>Expiry <span className="sort">↕</span></th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {PORTFOLIO_ROWS.map((r, i) => (
                    <tr key={i}>
                      <td><span className={`check${r.sel ? ' on' : ''}`}></span></td>
                      <td className="addr">
                        <div className="name">{r.name}</div>
                        <div className="ref">REF · {r.ref}</div>
                      </td>
                      <td className="vpid">{r.vpid}</td>
                      <td><BandPill band={r.band}/></td>
                      <td className="date">{r.verified}</td>
                      <td className={`date ${r.expiryWarn ? 'warn' : ''}`}>{r.expiry}</td>
                      <td>{STATUS_PILL(r.status)}</td>
                      <td className="act"><span className="more">⋯</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dv-pager">
              <span>Showing 1–12 of 87</span>
              <div className="pages">
                <span className="pg active">1</span>
                <span className="pg">2</span>
                <span className="pg">3</span>
                <span className="pg">…</span>
                <span className="pg">8</span>
                <span className="pg">›</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* Empty state — newly admitted Founding 50 partner */
function DevPortfolioEmpty() {
  return (
    <div className="dv-app">
      <DevRail active="portfolio"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Portfolio']} showSearch={false}/>
        <div className="dv-content">

          <div className="dv-empty">
            <div>
              <div className="eyebrow">Founding 50 · Cohort 014 · Admitted 02 May 2026</div>
              <h2>Welcome to <em>Verity.</em> Let's get your portfolio verified.</h2>
              <p>
                You're admitted. The next step is to submit your existing inventory — one property at a time, or as a CSV
                batch if you have many. First certificates are typically issued within two to four weeks, depending on
                portfolio size and document availability.
              </p>
              <div className="actions">
                <button className="dv-btn primary">Add your first property <span className="arrow">→</span></button>
                <button className="dv-btn outline">Bulk-import from spreadsheet</button>
              </div>
            </div>

            <div>
              <div style={{ fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:14 }}>
                What happens next
              </div>
              <div className="stages">
                <div className="stage">
                  <span className="num">01</span>
                  <div>
                    <div className="h">Submit your portfolio</div>
                    <div className="sub">Upload property details and supporting documents — survey plans, CofOs, deeds, governor's consents.</div>
                  </div>
                </div>
                <div className="stage">
                  <span className="num">02</span>
                  <div>
                    <div className="h">VERITY field verification</div>
                    <div className="sub">Our team verifies title, registry status, and on-site presence. We'll request anything missing.</div>
                  </div>
                </div>
                <div className="stage">
                  <span className="num">03</span>
                  <div>
                    <div className="h">Certificates issued</div>
                    <div className="sub">Each verified property receives a confidence band, a public URL, and a downloadable certificate.</div>
                  </div>
                </div>
                <div className="stage">
                  <span className="num">04</span>
                  <div>
                    <div className="h">Distribute &amp; close deals</div>
                    <div className="sub">Embed certificates on your listing pages, share URLs in sales conversations.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

window.DevPortfolio = DevPortfolio;
window.DevPortfolioEmpty = DevPortfolioEmpty;
