/* global React, DvmAppBar, DvmTabletRail, DvmBottomTabs, DvmPageBar, VP, Ico */
// VERITY · Account — mobile + tablet
// Company profile · team · subscription · Founding 50 status

function DvmAccount({ vp }) {
  if (VP.isPhone(vp)) {
    return (
      <div className={`dvm ${vp}`}>
        <DvmAppBar vp={vp} />
        <DvmPageBar
          eyebrow="04.9 · Account & billing"
          title="Account."
        />
        <AccountBody vp={vp} />
        <DvmBottomTabs active="account" />
      </div>
    );
  }
  return (
    <div className={`dvm ${vp}`}>
      <div className="dvm-railed">
        <DvmTabletRail vp={vp} active="account" />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <DvmAppBar vp={vp} />
          <DvmPageBar
            eyebrow="04.9 · Account & billing"
            title="Account."
          />
          <AccountBody vp={vp} />
        </div>
      </div>
    </div>
  );
}

function AccountBody({ vp }) {
  return (
    <div className="dvm-body pad" style={{ paddingBottom: VP.isPhone(vp) ? 100 : 32 }}>
      {/* Founding 50 status card */}
      <div className="dvm-founding">
        <div className="label">Founding 50 · Cohort 014</div>
        <div className="h">Lekki Heights Properties Ltd.</div>
        <div className="kv">
          <div>
            <div className="k">Seat</div>
            <div className="v gold">014 / 050</div>
          </div>
          <div>
            <div className="k">Joined</div>
            <div className="v">09 May 2026</div>
          </div>
          <div>
            <div className="k">Free issuances</div>
            <div className="v">38 of 50 remaining</div>
          </div>
          <div>
            <div className="k">Verification SLA</div>
            <div className="v gold">4-hour priority</div>
          </div>
        </div>
        <div style={{
          marginTop: 14, fontSize: 12.5,
          color: 'rgba(245,242,237,0.7)', lineHeight: 1.5,
        }}>
          Founding partners shape the Verity product. Quarterly roadmap calls
          with the product team — next session 18 June.
        </div>
      </div>

      {/* Company profile */}
      <div className="dvm-acct-section">
        <h3>Company profile</h3>
        <div className="dvm-kv">
          <div>
            <div className="k">Legal name</div>
            <div className="v">Lekki Heights Properties Ltd.</div>
          </div>
          <span className="edit">Edit</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">CAC registration</div>
            <div className="v mono">RC 1,847,221</div>
          </div>
          <span className="edit" style={{
            color: 'var(--success)', borderColor: 'rgba(79,143,79,0.32)',
          }}>Verified</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">Trading address</div>
            <div className="v">3rd Floor, Adekoya House,<br/>14 Akin Adesola, VI, Lagos</div>
          </div>
          <span className="edit">Edit</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">Tax ID</div>
            <div className="v mono">TIN · 2244-1188-09</div>
          </div>
          <span className="edit">Edit</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">Verity developer ID</div>
            <div className="v mono">VRT-DEV-2026-0014</div>
          </div>
          <span className="edit">{Ico.copy}</span>
        </div>
      </div>

      {/* Team */}
      <div className="dvm-acct-section">
        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Team · 4 members</span>
          <span style={{
            fontFamily: 'var(--f-meta)', fontSize: 10,
            color: 'var(--slate)', letterSpacing: '0.18em',
            textTransform: 'uppercase',
            borderBottom: '1px solid var(--line-strong)',
            paddingBottom: 1,
          }}>Invite</span>
        </h3>
        <div className="dvm-team-row">
          <div className="ava">AO</div>
          <div className="who">
            <div className="name">Adebola Ogundimu</div>
            <div className="email">adebola@lekkiheights.ng</div>
          </div>
          <div className="role">Owner</div>
        </div>
        <div className="dvm-team-row">
          <div className="ava" style={{ background: 'var(--gold-deep)' }}>OK</div>
          <div className="who">
            <div className="name">Oluwatosin Kalu</div>
            <div className="email">tosin@lekkiheights.ng</div>
          </div>
          <div className="role">Admin</div>
        </div>
        <div className="dvm-team-row">
          <div className="ava" style={{ background: 'var(--slate)' }}>FE</div>
          <div className="who">
            <div className="name">Funmi Edun</div>
            <div className="email">funmi@lekkiheights.ng</div>
          </div>
          <div className="role">Operator</div>
        </div>
        <div className="dvm-team-row">
          <div className="ava" style={{ background: 'var(--cream-deep)', color: 'var(--slate)' }}>+</div>
          <div className="who">
            <div className="name" style={{ color: 'var(--slate)' }}>finance@lekkiheights.ng</div>
            <div className="email">Invited · 3 days ago</div>
          </div>
          <div className="role" style={{ color: 'var(--slate-soft)' }}>Pending</div>
        </div>
      </div>

      {/* Subscription */}
      <div className="dvm-acct-section">
        <h3>Subscription &amp; billing</h3>
        <div className="dvm-kv">
          <div>
            <div className="k">Plan</div>
            <div className="v">Founding 50 · complimentary first year</div>
          </div>
          <span className="edit" style={{ color: 'var(--gold-deep)' }}>Manage</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">Renewal</div>
            <div className="v">09 May 2027 · Developer Standard</div>
          </div>
          <span className="edit">View</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">Payment method</div>
            <div className="v mono">Card · Mastercard •• 4421</div>
          </div>
          <span className="edit">Update</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">Billing email</div>
            <div className="v">finance@lekkiheights.ng</div>
          </div>
          <span className="edit">Edit</span>
        </div>
      </div>

      {/* Security */}
      <div className="dvm-acct-section">
        <h3>Security</h3>
        <div className="dvm-kv">
          <div>
            <div className="k">Two-factor</div>
            <div className="v">SMS · +234 803 442 1190</div>
          </div>
          <span className="edit" style={{ color: 'var(--success)' }}>On</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">Active sessions</div>
            <div className="v">2 · Lagos · Chrome &amp; iPhone</div>
          </div>
          <span className="edit">Review</span>
        </div>
        <div className="dvm-kv">
          <div>
            <div className="k">API keys</div>
            <div className="v">3 keys · Production · Sandbox</div>
          </div>
          <span className="edit">Manage</span>
        </div>
      </div>

      {/* Sign out */}
      <div style={{ marginTop: 16 }}>
        <button type="button" className="dvm-btn ghost" style={{
          color: 'var(--danger)', borderColor: 'var(--line)',
        }}>Sign out of all devices</button>
      </div>
    </div>
  );
}

Object.assign(window, { DvmAccount });
