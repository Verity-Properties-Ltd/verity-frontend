/* VERITY · Developer dashboard — Distribute (§4.6) */

function DevDistribute() {
  return (
    <div className="dv-app">
      <DevRail active="distribute"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Distribute']} showSearch={false}/>
        <div className="dv-content">

          <PageHead
            eyebrow="Revenue surface · 87 properties available"
            title='<em>Distribute</em> your verifications.'
            lede="Get certificate URLs, PDFs, embeds, and QR codes to deploy on your website, in sales conversations, and on physical signage. The richer your distribution, the more leverage you extract."
            actions={[
              <button key="a" className="dv-btn outline">Bulk download · ZIP</button>,
              <button key="b" className="dv-btn primary">Generate package <span className="arrow">→</span></button>,
            ]}
          />

          {/* Properties picker */}
          <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.22em', textTransform:'uppercase'}}>For</span>
            <span className="dv-chip active">All verified <span className="ct">81</span></span>
            <span className="dv-chip">Selected only <span className="ct">3</span></span>
            <span className="dv-chip">Single property <span className="caret">▾</span></span>
            <span style={{flex:1}}></span>
            <span style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:14, color:'var(--slate)'}}>
              VRT-LA-2025-0184 · Lekki Block A · Plot 12
            </span>
          </div>

          {/* Formats grid */}
          <div className="dv-formats">
            {/* Public URL */}
            <div className="dv-format">
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.24em'}}>FORMAT · 01</span>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--slate-soft)', letterSpacing:'0.16em'}}>PUBLIC LINK</span>
              </div>
              <div className="h">Verification URL</div>
              <div className="sub">A short, shareable URL anyone can resolve. Drop it into emails, SMS, social posts, or print.</div>
              <div className="preview">
                https://verity.properties/v/VRT-LA-2025-0184
              </div>
              <div className="actions">
                <button className="dv-btn primary sm">Copy URL</button>
                <button className="dv-btn outline sm">Bulk-copy 81 URLs</button>
              </div>
            </div>

            {/* PDF */}
            <div className="dv-format">
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.24em'}}>FORMAT · 02</span>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--slate-soft)', letterSpacing:'0.16em'}}>PRINT-READY</span>
              </div>
              <div className="h">PDF certificate</div>
              <div className="sub">Formatted Verification Report — print, attach to email, hand to a buyer at a sales meeting.</div>
              <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: '24px 18px', borderRadius: 3, marginBottom: 16, textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 92, height: 124,
                  background: '#fff', border: '1px solid var(--line)',
                  margin: '0 auto', position: 'relative',
                  boxShadow: '4px 4px 0 var(--cream-deep)',
                }}>
                  <div style={{position:'absolute', top:8, left:8, right:8, height:1, background:'var(--gold)'}}></div>
                  <div style={{position:'absolute', top:14, left:8, fontFamily:'Tenor Sans, serif', fontSize:8, letterSpacing:'0.2em', color:'var(--navy)'}}>VERITY</div>
                  <div style={{position:'absolute', top:32, left:8, right:8, fontFamily:'var(--f-display)', fontSize:9, color:'var(--navy)', textAlign:'left', lineHeight:1.2}}>Verification Report</div>
                  <div style={{position:'absolute', top:54, left:8, fontFamily:'DM Mono, monospace', fontSize:6, color:'var(--slate)', letterSpacing:'0.1em'}}>VRT-LA-2025-0184</div>
                  <div style={{position:'absolute', bottom:14, left:8, right:8, height:6, background:'var(--gold)', borderRadius:1}}></div>
                  <div style={{position:'absolute', bottom:6, left:8, fontFamily:'DM Mono, monospace', fontSize:6, color:'var(--gold-deep)', letterSpacing:'0.18em'}}>GOLD</div>
                </div>
                <div style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--slate)', letterSpacing:'0.16em', marginTop:14}}>
                  PDF · A4 · 2 PAGES · 184 KB
                </div>
              </div>
              <div className="actions">
                <button className="dv-btn primary sm">Download PDF</button>
                <button className="dv-btn outline sm">Bulk · ZIP (81)</button>
              </div>
            </div>

            {/* Embed */}
            <div className="dv-format">
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.24em'}}>FORMAT · 03</span>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--slate-soft)', letterSpacing:'0.16em'}}>WEBSITE EMBED</span>
              </div>
              <div className="h">HTML embed snippet</div>
              <div className="sub">Renders the band pill plus a "View verification" link on your own listing page. Auto-updates if the band changes.</div>
              <div className="preview code">
                <span className="tag">&lt;script</span> <span className="attr">src</span>=<span className="str">"https://cdn.verity.properties/embed.js"</span> <span className="attr">data-vpid</span>=<span className="str">"VRT-LA-2025-0184"</span> <span className="tag">async&gt;&lt;/script&gt;</span>
              </div>
              <div className="actions">
                <button className="dv-btn primary sm">Copy snippet</button>
                <button className="dv-btn outline sm">Embed preview</button>
                <button className="dv-btn outline sm">Style options</button>
              </div>
            </div>

            {/* QR */}
            <div className="dv-format">
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.24em'}}>FORMAT · 04</span>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--slate-soft)', letterSpacing:'0.16em'}}>OFFLINE / SIGNAGE</span>
              </div>
              <div className="h">QR code</div>
              <div className="sub">Printable QR resolving to the public verification URL. For sales offices, signboards, brochures, on-site posts.</div>
              <div className="qr">
                {/* Stylised QR */}
                <svg width="100" height="100" viewBox="0 0 21 21" fill="none">
                  <rect width="21" height="21" fill="#fff"/>
                  {/* Position markers */}
                  <rect x="0" y="0" width="7" height="7" fill="#1E2260"/>
                  <rect x="1" y="1" width="5" height="5" fill="#fff"/>
                  <rect x="2" y="2" width="3" height="3" fill="#1E2260"/>
                  <rect x="14" y="0" width="7" height="7" fill="#1E2260"/>
                  <rect x="15" y="1" width="5" height="5" fill="#fff"/>
                  <rect x="16" y="2" width="3" height="3" fill="#1E2260"/>
                  <rect x="0" y="14" width="7" height="7" fill="#1E2260"/>
                  <rect x="1" y="15" width="5" height="5" fill="#fff"/>
                  <rect x="2" y="16" width="3" height="3" fill="#1E2260"/>
                  {/* Random data cells */}
                  {[
                    [8,1],[10,1],[12,1],[8,3],[11,3],[13,3],[9,4],[12,4],[8,6],[10,6],
                    [1,8],[3,8],[5,8],[7,8],[8,8],[10,8],[12,8],[14,8],[16,8],[18,8],
                    [2,9],[4,9],[8,9],[11,9],[13,9],[15,9],[17,9],[19,9],
                    [1,10],[3,10],[6,10],[8,10],[10,10],[12,10],[14,10],[16,10],[18,10],[20,10],
                    [2,11],[5,11],[7,11],[9,11],[11,11],[13,11],[15,11],[17,11],[19,11],
                    [1,12],[3,12],[6,12],[8,12],[12,12],[16,12],[18,12],
                    [9,13],[11,13],[13,13],[15,13],[17,13],[19,13],
                    [8,14],[10,15],[12,15],[14,15],[16,15],[18,15],[20,15],
                    [9,16],[11,17],[13,17],[15,17],[17,17],[19,17],
                    [8,18],[10,19],[12,19],[14,19],[16,19],[18,19],[20,19],
                    [9,20],[11,20],[13,20],[15,20],[17,20],[19,20],
                  ].map((p, i) => (
                    <rect key={i} x={p[0]} y={p[1]} width="1" height="1" fill="#1E2260"/>
                  ))}
                  {/* Centred V mark */}
                  <rect x="9" y="9" width="3" height="3" fill="var(--gold)" stroke="#fff" strokeWidth="0.4"/>
                </svg>
              </div>
              <div style={{textAlign:'center', fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.18em', margin:'10px 0 14px'}}>
                VRT-LA-2025-0184
              </div>
              <div className="actions">
                <button className="dv-btn primary sm">Download · PNG</button>
                <button className="dv-btn outline sm">SVG</button>
                <button className="dv-btn outline sm">Print sheet</button>
              </div>
            </div>

            {/* Founding Partner badge */}
            <div className="dv-format" style={{ gridColumn: '1 / -1' }}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.24em'}}>FORMAT · 05</span>
                <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--slate-soft)', letterSpacing:'0.16em'}}>BRAND ASSET</span>
              </div>
              <div className="h">Founding Partner badge</div>
              <div className="sub">For your homepage. Signals VERITY membership. Available in light, dark, and horizontal lockups.</div>

              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginTop:8}}>
                {/* Light */}
                <div className="badge-preview" style={{flexDirection:'column', gap:10}}>
                  <div style={{
                    border: '1px solid var(--gold)', padding: '14px 22px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    background: '#fff'
                  }}>
                    <div style={{fontFamily:'DM Mono, monospace', fontSize:8, color:'var(--gold-deep)', letterSpacing:'0.28em'}}>FOUNDING 50</div>
                    <div style={{fontFamily:'Tenor Sans, serif', fontSize:14, color:'var(--navy)', letterSpacing:'0.22em'}}>VERITY</div>
                    <div style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:11, color:'var(--slate)'}}>Verified developer · 2026</div>
                  </div>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--slate)', letterSpacing:'0.18em'}}>LIGHT · STACKED</span>
                </div>

                {/* Dark */}
                <div className="badge-preview" style={{flexDirection:'column', gap:10, background:'var(--navy-deep)'}}>
                  <div style={{
                    border: '1px solid var(--gold)', padding: '14px 22px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    background: 'var(--navy-deep)'
                  }}>
                    <div style={{fontFamily:'DM Mono, monospace', fontSize:8, color:'var(--gold)', letterSpacing:'0.28em'}}>FOUNDING 50</div>
                    <div style={{fontFamily:'Tenor Sans, serif', fontSize:14, color:'var(--cream)', letterSpacing:'0.22em'}}>VERITY</div>
                    <div style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:11, color:'rgba(245,242,237,0.6)'}}>Verified developer · 2026</div>
                  </div>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold)', letterSpacing:'0.18em'}}>DARK · STACKED</span>
                </div>

                {/* Horizontal */}
                <div className="badge-preview" style={{flexDirection:'column', gap:10}}>
                  <div style={{
                    border: '1px solid var(--gold)', padding: '14px 22px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: '#fff'
                  }}>
                    <div style={{fontFamily:'Tenor Sans, serif', fontSize:14, color:'var(--navy)', letterSpacing:'0.22em', borderRight:'1px solid var(--line)', paddingRight:14}}>VERITY</div>
                    <div style={{textAlign:'left'}}>
                      <div style={{fontFamily:'DM Mono, monospace', fontSize:8, color:'var(--gold-deep)', letterSpacing:'0.22em'}}>FOUNDING 50</div>
                      <div style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:11, color:'var(--slate)'}}>Verified developer · 2026</div>
                    </div>
                  </div>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--slate)', letterSpacing:'0.18em'}}>LIGHT · HORIZONTAL</span>
                </div>
              </div>

              <div className="actions" style={{marginTop:18}}>
                <button className="dv-btn primary sm">Download · PNG (all)</button>
                <button className="dv-btn outline sm">SVG</button>
                <button className="dv-btn outline sm">Brand guidelines</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

window.DevDistribute = DevDistribute;
