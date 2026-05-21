/* VERITY · Developer dashboard — Add property (§4.4)
   Two modes: Single submission, Bulk CSV import. */

function DevAddProperty() {
  return (
    <div className="dv-app">
      <DevRail active="add"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Portfolio', 'Add property']} showSearch={false}/>
        <div className="dv-content">

          <PageHead
            eyebrow="Step 02 of 05 · Property details"
            title='Add a <em>property</em>'
            lede="Submit a single property for verification, or batch up to 25 in one workflow."
          />

          {/* Mode toggle */}
          <div className="dv-wiz-mode">
            <div className="tab on">Single property</div>
            <div className="tab">Batch · up to 25 <span className="ct">FOUNDING 50</span></div>
            <div className="tab">CSV import</div>
          </div>

          <div className="dv-wizard">
            {/* Side rail with steps */}
            <aside className="dv-wiz-side">
              <div style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:14}}>
                Submission · 5 steps
              </div>
              {[
                { n: '01', label: 'Property type & address', state: 'done' },
                { n: '02', label: 'Title documents',         state: 'current' },
                { n: '03', label: 'Internal reference',      state: '' },
                { n: '04', label: 'Verification tier',       state: '' },
                { n: '05', label: 'Review & submit',         state: '' },
              ].map(s => (
                <div key={s.n} className={`step ${s.state}`}>
                  <span className="num">{s.n}</span>
                  <span className="h">{s.label}</span>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: '14px 16px', background: 'var(--cream)', border: '1px solid var(--line)', borderRadius: 4 }}>
                <div style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:6}}>Cohort pricing</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:18, color:'var(--navy)', lineHeight:1.3}}>
                  Free verification through Q3 2027.
                </div>
                <div style={{fontSize:11, color:'var(--slate)', marginTop:4}}>Founding 50 · cohort 014</div>
              </div>
            </aside>

            {/* Form body */}
            <div>
              <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: 32 }}>
                <div style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--gold-deep)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:8}}>Step 02 · Title documents</div>
                <h2 style={{fontFamily:'var(--f-display)', fontSize:28, fontWeight:500, color:'var(--navy)', margin:0, letterSpacing:'-0.005em'}}>
                  Upload <em style={{fontStyle:'italic', color:'var(--gold-deep)', fontWeight:400}}>title evidence</em> for this property.
                </h2>
                <p style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:16, color:'var(--slate)', marginTop:8, maxWidth:'56ch'}}>
                  Provide as much as you have. The more documents we receive, the higher the confidence band you'll achieve.
                </p>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16, marginTop: 28 }}>
                  {[
                    { name: 'Certificate of Occupancy (CofO)', sub: 'CofO_Lekki_BlockA_P12.pdf · 2.4 MB', status: 'uploaded' },
                    { name: 'Survey plan', sub: 'Survey_LasG_2024-187.pdf · 1.1 MB', status: 'uploaded' },
                    { name: 'Deed of assignment', sub: 'Required · drag file or click', status: 'pending' },
                    { name: 'Governor\'s consent', sub: 'Optional · raises band to Gold', status: 'pending' },
                  ].map((d, i) => (
                    <div key={i} style={{
                      background: '#fff',
                      border: d.status === 'uploaded' ? '1px solid var(--gold-soft)' : '1px dashed var(--line-strong)',
                      padding: 16, borderRadius: 4,
                      display: 'flex', gap: 14, alignItems: 'center'
                    }}>
                      <div style={{
                        width: 40, height: 48,
                        background: d.status === 'uploaded' ? 'var(--cream-shade)' : 'var(--cream)',
                        border: '1px solid var(--line)', borderRadius: 2,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--slate)', letterSpacing: '0.1em'
                      }}>PDF</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}>{d.name}</div>
                        <div style={{ fontFamily:'DM Mono, monospace', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', marginTop: 2 }}>{d.sub}</div>
                      </div>
                      {d.status === 'uploaded' && (
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#4F8F4F', letterSpacing: '0.18em' }}>✓ DONE</span>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                  <button className="dv-btn ghost">← Back to address</button>
                  <div style={{display:'flex', gap:8}}>
                    <button className="dv-btn outline">Save draft</button>
                    <button className="dv-btn primary">Continue · reference <span className="arrow">→</span></button>
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

/* CSV bulk import view */
function DevBulkCsv() {
  return (
    <div className="dv-app">
      <DevRail active="add"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Portfolio', 'Add property', 'CSV import']} showSearch={false}/>
        <div className="dv-content">

          <PageHead
            eyebrow="Bulk import · validating"
            title='<em>CSV</em> import preview'
            lede="We've parsed your file. Review the rows below — fix any warnings, then attach supporting documents per property."
            actions={[
              <button key="a" className="dv-btn outline">Replace file</button>,
              <button key="b" className="dv-btn primary">Continue to documents <span className="arrow">→</span></button>,
            ]}
          />

          <div className="dv-csv">
            <div className="icon-pad">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 3h7l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#1E2260" strokeWidth="1.4" fill="#fff"/>
                <path d="M12 3v3h3M7 11h6M7 14h4" stroke="#1E2260" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="h">portfolio_lekki_2026.csv · 18 rows parsed</div>
            <div className="sub">15 valid · 2 warnings · 1 duplicate VPID detected</div>
          </div>

          <div className="dv-csv-table">
            <div className="dv-csv-row head">
              <span></span>
              <span>Property address</span>
              <span>Type</span>
              <span>State</span>
              <span>Internal ref</span>
              <span>Validation</span>
            </div>
            {[
              { addr: 'Lekki Block A · Plot 12',         type: 'Land',     state: 'Lagos', ref: 'LKI-A-12',   v: 'ok' },
              { addr: 'Ikoyi Foreshore · Unit 7B',       type: 'Apartment', state: 'Lagos', ref: 'IKY-FS-07B', v: 'ok' },
              { addr: 'Victoria Island Tower II · Fl 14', type: 'Apartment', state: 'Lagos', ref: 'VI-T2-14',   v: 'ok' },
              { addr: 'Banana Island · Villa 3',          type: 'Villa',    state: 'Lagos', ref: 'BNI-V03',    v: 'warn', warn: 'Address ambiguous' },
              { addr: 'Surulere Block C · Plot 04',       type: 'Land',     state: 'Lagos', ref: 'SUR-C-04',   v: 'dup', warn: 'Duplicate of VRT-LA-2024-0089' },
              { addr: 'Magodo Phase II · Plot 18',        type: 'Land',     state: 'Lagos', ref: 'MGD-2-18',   v: 'ok' },
              { addr: 'Yaba Heights · Unit 22',           type: 'Apartment', state: 'Lagos', ref: 'YBH-22',     v: 'ok' },
            ].map((r, i) => (
              <div key={i} className="dv-csv-row">
                <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.12em'}}>{String(i+1).padStart(2,'0')}</span>
                <span style={{ color: 'var(--navy)', fontWeight: 500 }}>{r.addr}</span>
                <span style={{ color: 'var(--slate)' }}>{r.type}</span>
                <span style={{ color: 'var(--slate)' }}>{r.state}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--navy)', letterSpacing: '0.06em' }}>{r.ref}</span>
                <span>
                  {r.v === 'ok' && <span className="ok"><span className="dot"></span>VALID</span>}
                  {r.v === 'warn' && <span className="ok warn" style={{color:'var(--gold-deep)'}}>⚠ {r.warn}</span>}
                  {r.v === 'dup' && <span className="ok" style={{color:'#B07A4A'}}>⚠ DUPLICATE</span>}
                </span>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}

window.DevAddProperty = DevAddProperty;
window.DevBulkCsv = DevBulkCsv;
