/* VERITY · Developer dashboard — Single property detail (§4.5) */

function DevPropertyDetail() {
  return (
    <div className="dv-app">
      <DevRail active="portfolio"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Portfolio', 'VRT-LA-2025-0184']} showSearch={false}/>
        <div className="dv-content">

          {/* Property hero */}
          <div className="dv-prop-hero">
            <div className="row">
              <div>
                <div className="ref">REF · LKI-A-12 · Internal</div>
                <h2><em>Lekki Block A</em> · Plot 12</h2>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:16, color:'var(--slate)', marginTop:6}}>
                  Lekki Phase II, Lagos State · 1,250 sqm · Land
                </div>
                <div className="meta-row">
                  <div><span style={{color:'var(--slate)'}}>VPID · </span><span className="v" style={{fontWeight:500}}>VRT-LA-2025-0184</span></div>
                  <div><span style={{color:'var(--slate)'}}>VERIFIED · </span><span className="v">12 MAY 2026</span></div>
                  <div><span style={{color:'var(--slate)'}}>EXPIRES · </span><span className="v">12 MAY 2027</span></div>
                  <div><span style={{color:'var(--slate)'}}>STATUS · </span><span className="v" style={{color:'#4F8F4F'}}>● ACTIVE</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
                <BandPill band="gold"/>
                <div style={{display:'flex', gap:8}}>
                  <button className="dv-btn outline">⟲ Refresh</button>
                  <button className="dv-btn outline">↗ Distribute</button>
                  <button className="dv-btn primary">View certificate</button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="dv-tabs">
            <span className="tab active">Overview</span>
            <span className="tab">Verification history <span style={{opacity:0.5,marginLeft:4}}>· 4</span></span>
            <span className="tab">Distribution log <span style={{opacity:0.5,marginLeft:4}}>· 38</span></span>
            <span className="tab">Edit metadata</span>
          </div>

          <div className="dv-prop">
            {/* Main column — verification history */}
            <div>
              <div className="dv-block-head">
                <h3 style={{fontFamily:'Tenor Sans, serif', fontSize:14, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--navy)', fontWeight:400, margin:0}}>
                  Verification history
                </h3>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.18em'}}>
                  4 events · oldest first hidden
                </span>
              </div>

              <div className="dv-history" style={{marginTop:14}}>
                <div className="dv-history-item">
                  <span className="marker"></span>
                  <div>
                    <div className="when">12 MAY 2026 · 08:42 WAT</div>
                    <div className="h">Verification refreshed — band held at <strong>Gold</strong></div>
                    <div className="sub">All title evidence reverified. Court-cleared. No new liens detected. Certificate URL unchanged.</div>
                    <div className="change">⟲ REFRESH · 2,847 NGN · paid via cohort credit</div>
                  </div>
                </div>

                <div className="dv-history-item">
                  <span className="marker"></span>
                  <div>
                    <div className="when">14 NOV 2025 · 11:08 WAT</div>
                    <div className="h">Band upgraded — <strong>Silver → Gold</strong></div>
                    <div className="sub">Governor's consent received and verified. Boundary confirmed via Lagos State Lands Bureau.</div>
                    <div className="change">↑ BAND CHANGE · Silver → Gold</div>
                  </div>
                </div>

                <div className="dv-history-item">
                  <span className="marker"></span>
                  <div>
                    <div className="when">22 MAY 2025 · 16:24 WAT</div>
                    <div className="h">First verification issued — <strong>Silver</strong></div>
                    <div className="sub">CofO authenticated. Survey plan matched LasG records. Field visit confirmed presence and demarcation.</div>
                    <div className="change">⊕ ISSUED · Silver band</div>
                  </div>
                </div>

                <div className="dv-history-item">
                  <span className="marker"></span>
                  <div>
                    <div className="when">02 MAY 2025 · 09:15 WAT</div>
                    <div className="h">Submission received</div>
                    <div className="sub">Submitted by Adeola Ogundipe. CofO + survey plan + deed of assignment uploaded.</div>
                  </div>
                </div>
              </div>

              {/* Distribution log preview */}
              <div style={{ marginTop: 40 }}>
                <div className="dv-block-head">
                  <h3 style={{fontFamily:'Tenor Sans, serif', fontSize:14, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--navy)', fontWeight:400, margin:0}}>
                    Distribution log · last 30 days
                  </h3>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.18em'}}>
                    38 of 184 lifetime · view all
                  </span>
                </div>

                <div className="dv-feed" style={{marginTop:14}}>
                  {[
                    { when: '11 May · 14:08', what: 'Public certificate viewed via', src: 'lekkiheights.com/lekki-block-a' },
                    { when: '11 May · 11:42', what: 'PDF certificate downloaded by', src: 'sales@lekkiheights.com' },
                    { when: '10 May · 16:55', what: 'Embed snippet rendered on', src: 'lekkiheights.com/inventory' },
                    { when: '09 May · 09:31', what: 'QR code scanned at', src: 'On-site signage · Plot 12' },
                    { when: '07 May · 14:02', what: 'Public certificate viewed via', src: 'verity.properties/v/VRT-LA-2025-0184' },
                  ].map((e, i) => (
                    <div key={i} className="dv-feed-item">
                      <span className="when">{e.when}</span>
                      <span className="what">
                        {e.what} <em>{e.src}</em>
                      </span>
                      <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.14em'}}>
                        {i === 0 ? 'WEB · LAGOS' : i === 1 ? 'EMAIL' : i === 2 ? 'EMBED' : i === 3 ? 'QR · GPS' : 'DIRECT'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — metadata */}
            <aside>
              <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: 22 }}>
                <div style={{fontFamily:'Tenor Sans, serif', fontSize:12, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--navy)', marginBottom:14}}>
                  Sales metadata
                </div>
                {[
                  { k: 'Internal reference', v: 'LKI-A-12' },
                  { k: 'Sales status',       v: 'Active · listed' },
                  { k: 'List price',         v: '₦ 165,000,000' },
                  { k: 'Buyer',              v: '—' },
                  { k: 'Notes',              v: 'Premium plot · waterfront access' },
                ].map((kv, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{kv.k}</div>
                    <div style={{ fontSize: 13, color: 'var(--navy)', marginTop: 4 }}>{kv.v}</div>
                  </div>
                ))}
                <button className="dv-btn outline" style={{marginTop:14, width:'100%', justifyContent:'center'}}>Edit metadata</button>
              </div>

              <div style={{ marginTop: 16, background: 'var(--cream-shade)', border: '1px solid var(--line)', padding: 22 }}>
                <div style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:8}}>
                  Public verification URL
                </div>
                <div style={{fontFamily:'DM Mono, monospace', fontSize:12, color:'var(--navy)', wordBreak:'break-all', lineHeight:1.5}}>
                  verity.properties/v/<br/>VRT-LA-2025-0184
                </div>
                <div style={{display:'flex', gap:8, marginTop:14}}>
                  <button className="dv-btn outline sm" style={{flex:1, justifyContent:'center'}}>Copy URL</button>
                  <button className="dv-btn outline sm" style={{flex:1, justifyContent:'center'}}>QR code</button>
                </div>
              </div>
            </aside>
          </div>

        </div>
      </main>
    </div>
  );
}

window.DevPropertyDetail = DevPropertyDetail;
