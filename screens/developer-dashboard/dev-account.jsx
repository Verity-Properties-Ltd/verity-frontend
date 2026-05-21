/* VERITY · Developer dashboard — Account & billing (§4.7) */

function DevAccount() {
  return (
    <div className="dv-app">
      <DevRail active="account"/>
      <main className="dv-main">
        <DevTopbar crumbs={['Lekki Heights Properties Ltd', 'Account & billing']} showSearch={false}/>
        <div className="dv-content">

          <PageHead
            eyebrow="Account · admin · Adeola Ogundipe"
            title='<em>Account</em> & billing'
            lede="Company profile, team access, subscription, and your Founding 50 partnership terms."
          />

          <div className="dv-acct-grid">
            <div>
              {/* Company profile */}
              <section className="dv-acct-section">
                <h3>Company profile</h3>
                <div className="dv-kv">
                  <span className="k">Registered name</span>
                  <span className="v">Lekki Heights Properties Ltd.</span>
                  <span className="edit">Edit</span>
                </div>
                <div className="dv-kv">
                  <span className="k">RC Number</span>
                  <span className="v mono">RC-1184937</span>
                  <span></span>
                </div>
                <div className="dv-kv">
                  <span className="k">LASRERA registration</span>
                  <span className="v mono">LSR-D-2024-00472</span>
                  <span></span>
                </div>
                <div className="dv-kv">
                  <span className="k">Registered address</span>
                  <span className="v">12B Admiralty Way, Lekki Phase 1, Lagos</span>
                  <span className="edit">Edit</span>
                </div>
                <div className="dv-kv">
                  <span className="k">Primary contact</span>
                  <span className="v">Adeola Ogundipe · adeola@lekkiheights.com</span>
                  <span className="edit">Edit</span>
                </div>
              </section>

              {/* Team */}
              <section className="dv-acct-section">
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14}}>
                  <h3 style={{margin:0}}>Team members</h3>
                  <button className="dv-btn outline sm">+ Invite member</button>
                </div>
                {[
                  { i:'AO', name: 'Adeola Ogundipe', email: 'adeola@lekkiheights.com', role: 'Admin' },
                  { i:'TA', name: 'Tobi Adesina',    email: 'tobi@lekkiheights.com',   role: 'Editor' },
                  { i:'KE', name: 'Kemi Etomi',      email: 'kemi@lekkiheights.com',   role: 'Editor' },
                  { i:'OB', name: 'Olu Bankole',     email: 'olu@lekkiheights.com',    role: 'Viewer' },
                ].map((m, i) => (
                  <div key={i} className="dv-team-row">
                    <span className="ava">{m.i}</span>
                    <div className="who">
                      <div className="name">{m.name}</div>
                      <div className="email">{m.email}</div>
                    </div>
                    <span className="role">{m.role}</span>
                    <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.18em', cursor:'pointer'}}>Manage</span>
                  </div>
                ))}
              </section>

              {/* Subscription */}
              <section className="dv-acct-section">
                <h3>Subscription</h3>
                <div className="dv-kv">
                  <span className="k">Tier</span>
                  <span className="v"><strong style={{color:'var(--gold-deep)'}}>Founding 50 · Cohort 014</strong> · all features included</span>
                  <span></span>
                </div>
                <div className="dv-kv">
                  <span className="k">Verifications · used</span>
                  <span className="v">87 of unlimited <span style={{color:'var(--slate)'}}>(through Q3 2027)</span></span>
                  <span></span>
                </div>
                <div className="dv-kv">
                  <span className="k">Next billing date</span>
                  <span className="v">— · post-cohort billing begins 01 Oct 2027</span>
                  <span></span>
                </div>
                <div className="dv-kv">
                  <span className="k">Payment method</span>
                  <span className="v mono">**** **** **** 4192 · Mastercard · exp 09/28</span>
                  <span className="edit">Replace</span>
                </div>
              </section>

              {/* Invoices */}
              <section className="dv-acct-section">
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14}}>
                  <h3 style={{margin:0}}>Invoices</h3>
                  <span style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.18em'}}>3 of 3 · all paid</span>
                </div>
                <div className="dv-table-wrap">
                  <table className="dv-table">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Period</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id:'INV-2026-0512', period:'Apr 2026', amt:'₦ 0.00', note:'Cohort credit' },
                        { id:'INV-2026-0408', period:'Mar 2026', amt:'₦ 0.00', note:'Cohort credit' },
                        { id:'INV-2026-0301', period:'Feb 2026', amt:'₦ 0.00', note:'Cohort credit' },
                      ].map(r => (
                        <tr key={r.id}>
                          <td className="vpid">{r.id}</td>
                          <td className="date">{r.period}</td>
                          <td className="vpid">{r.amt}</td>
                          <td><span className="dv-status-pill active"><span className="dot"></span>Paid · {r.note}</span></td>
                          <td className="act"><span className="more" title="Download">⤓</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Compliance docs */}
              <section className="dv-acct-section">
                <h3>Compliance documents</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 14 }}>
                  {[
                    { name: 'Data Processing Agreement', sig: 'Signed · 02 May 2026' },
                    { name: 'Master Services Agreement', sig: 'Signed · 02 May 2026' },
                    { name: 'Service Level Agreement', sig: 'Signed · 02 May 2026' },
                  ].map((d, i) => (
                    <div key={i} style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: '14px 16px', borderRadius: 4 }}>
                      <div style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.22em', textTransform:'uppercase'}}>{d.name.split(' ').map(w => w[0]).join('')}</div>
                      <div style={{fontSize:13, color:'var(--navy)', fontWeight:500, marginTop:6}}>{d.name}</div>
                      <div style={{fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.12em', marginTop:6}}>{d.sig}</div>
                      <div style={{marginTop:10, fontFamily:'DM Mono, monospace', fontSize:10, color:'var(--slate)', letterSpacing:'0.18em', textTransform:'uppercase'}}>
                        <span style={{borderBottom:'1px solid var(--line)', paddingBottom:1, cursor:'pointer'}}>Download PDF</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right column — Founding 50 status card */}
            <aside>
              <div className="dv-founding-card">
                <div className="label">Founding 50</div>
                <div className="h">Cohort 014 · admitted.</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:14, color:'rgba(245,242,237,0.7)', marginTop:8, lineHeight:1.5}}>
                  You are one of fifty Lagos-based developers building VERITY's foundational verification corpus.
                </div>
                <div className="kv">
                  <div>
                    <div className="k">Admitted</div>
                    <div className="v">02 MAY 2026</div>
                  </div>
                  <div>
                    <div className="k">Cohort number</div>
                    <div className="v gold">014 / 050</div>
                  </div>
                  <div>
                    <div className="k">Free until</div>
                    <div className="v">30 SEP 2027</div>
                  </div>
                  <div>
                    <div className="k">Advisor</div>
                    <div className="v">Sheun Badmus</div>
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(245,242,237,0.12)' }}>
                  <div style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'rgba(245,242,237,0.5)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:6}}>Direct line</div>
                  <div style={{fontFamily:'DM Mono, monospace', fontSize:12, color:'var(--cream)'}}>sheun@verity.properties</div>
                  <div style={{fontFamily:'DM Mono, monospace', fontSize:12, color:'var(--cream)', marginTop:2}}>+234 · 808 · 0114</div>
                </div>
                <button className="dv-btn gold sm" style={{marginTop:18, width:'100%', justifyContent:'center'}}>Schedule a call</button>
              </div>

              <div style={{ marginTop: 18, padding: 18, background: 'var(--cream)', border: '1px solid var(--line)' }}>
                <div style={{fontFamily:'DM Mono, monospace', fontSize:9, color:'var(--gold-deep)', letterSpacing:'0.22em', textTransform:'uppercase', marginBottom:8}}>Cohort benefit</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:18, color:'var(--navy)', lineHeight:1.3}}>
                  Free verification for all properties added through Q3 2027.
                </div>
                <div style={{fontSize:13, color:'var(--slate)', marginTop:10, lineHeight:1.5}}>
                  No per-property cost. No tier limits. Refreshes included.
                </div>
              </div>
            </aside>
          </div>

        </div>
      </main>
    </div>
  );
}

window.DevAccount = DevAccount;
