/* global React, DvmAuthShell, Ico, VP */
// VERITY · Developer signup — mobile + tablet
// 6 states: default, filled, submitting, email_exists, verification_sent, invalid_invite

function DvmSignupForm({ vp, state, withInvite = true }) {
  const filled = state === 'filled' || state === 'submitting' || state === 'email_exists';
  const submitting = state === 'submitting';
  const err = state === 'email_exists';
  const disabled = state === 'default';
  const strength = filled ? 'Strong' : 'Empty';

  return (
    <DvmAuthShell vp={vp} withInvite={withInvite}>
      {/* Invite card — visible on all form states */}
      <div className="dvm-invite-card">
        <div className="label">Founding 50 invitation</div>
        <div className="h">Lekki Heights <em>Properties Ltd.</em></div>
        <div className="sub">Invited by Verity onboarding · Lagos cohort 01 · 47 of 50 seats claimed.</div>
        <div className="kv">
          <div><div className="k">Code</div><div className="v gold">INV-LH-7QH3M9</div></div>
          <div><div className="k">Expires</div><div className="v">14 Jun 2026</div></div>
        </div>
      </div>

      <h1>Create your <em>workspace.</em></h1>
      <p className="lede">
        Set up your developer account. We'll verify your company and ID after — issuance unlocks once verification clears.
      </p>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="dvm-field">
          <label>Full name</label>
          <input type="text" autoComplete="name" placeholder="Adebola Ogundimu"
            defaultValue={filled ? 'Adebola Ogundimu' : ''}
            disabled={submitting} />
        </div>
        <div className="dvm-field">
          <label>Work email</label>
          <input type="email" autoComplete="email" placeholder="you@company.com"
            className={err ? 'err' : ''}
            defaultValue={filled ? 'adebola@lekkiheights.ng' : ''}
            disabled={submitting} />
          {err && (
            <div className="err-msg">
              <span style={{ width: 14, height: 14, borderRadius: 999, background: 'var(--danger)',
                color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700 }}>!</span>
              An account with this email exists. <a href="#" style={{ color: 'var(--navy)', textDecoration: 'underline', marginLeft: 4 }}>Sign in</a>
            </div>
          )}
        </div>
        <div className="dvm-field">
          <label>Company name</label>
          <input type="text" placeholder="Lekki Heights Properties Ltd."
            defaultValue={filled ? 'Lekki Heights Properties Ltd.' : ''}
            disabled={submitting} />
          <div className="hint">Must match your CAC registration. We verify this next.</div>
        </div>
        <div className="dvm-field">
          <label>Phone (Nigeria)</label>
          <input type="tel" placeholder="+234 ___ ___ ____"
            defaultValue={filled ? '+234 803 442 1190' : ''}
            disabled={submitting} />
        </div>
        <div className="dvm-field">
          <label>Password</label>
          <div className="field-wrap">
            <input type="password" className="has-icon"
              placeholder="Min 12 characters · 1 number · 1 symbol"
              defaultValue={filled ? '••••••••••••••••' : ''}
              disabled={submitting} />
            <span className="toggle-eye">Show</span>
          </div>
          <div className={`dvm-strength ${filled ? '' : 'weak'}`}>
            <div className={`bar ${filled ? 'strong' : ''}`}></div>
            <div className={`bar ${filled ? 'strong' : ''}`}></div>
            <div className={`bar ${filled ? 'strong' : ''}`}></div>
            <div className={`bar ${filled ? 'strong' : ''}`}></div>
          </div>
          <div className="dvm-strength weak" style={{ display: 'block' }}>
            <div className="label">Strength · <span className="v">{strength}</span></div>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 18,
          fontSize: 12.5, color: 'var(--slate)', lineHeight: 1.5,
        }}>
          <span style={{
            width: 18, height: 18, borderRadius: 4, flexShrink: 0,
            border: '1px solid var(--line-strong)',
            background: filled ? 'var(--navy)' : '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--cream)',
          }}>
            {filled && Ico.check}
          </span>
          <span>I accept the <a href="#" style={{ color: 'var(--navy)' }}>Verity Developer Agreement</a> and acknowledge that
            certificate issuance is gated by KYC verification.</span>
        </div>

        <div className="dvm-actions">
          <button type="submit" className="dvm-btn"
            disabled={disabled || submitting}>
            {submitting ? (<><span className="spinner"></span> Creating account…</>) : (
              <><span>Create account</span> <span className="arrow">→</span></>
            )}
          </button>
          <button type="button" className="dvm-btn ghost">I already have an account</button>
        </div>

        <div className="dvm-foot">
          Protected by <a href="#">Mono KYC</a> · <a href="#">Privacy</a> · <a href="#">Terms</a>
        </div>
      </form>
    </DvmAuthShell>
  );
}

function DvmSignupVerificationSent({ vp }) {
  return (
    <DvmAuthShell vp={vp} withInvite={false}>
      <div className="dvm-confirm">
        <div className="seal">✓</div>
        <h2>Check your <em>inbox.</em></h2>
        <p>We've sent a verification link to confirm it's you. Open the message and tap <em>Verify email</em> — the link expires in 30 minutes.</p>
        <div className="mail">adebola@lekkiheights.ng</div>
        <div className="dvm-actions" style={{ maxWidth: 320, margin: '0 auto' }}>
          <button type="button" className="dvm-btn outline">Open mail app</button>
        </div>
        <div className="resend">
          Didn't get it? <em>Resend verification</em>
          <div style={{ marginTop: 6, color: 'var(--slate-soft)' }}>Available in 0:54</div>
        </div>
      </div>
    </DvmAuthShell>
  );
}

function DvmSignupInvalidInvite({ vp }) {
  return (
    <DvmAuthShell vp={vp} withInvite={false}>
      <div className="dvm-invalid">
        <div className="ic">!</div>
        <h2>This invitation has expired.</h2>
        <p>
          Founding 50 invitation links are valid for 14 days. Your link expired on 28 Apr 2026.
          Reach out to your Verity onboarding contact to issue a fresh link.
        </p>
        <div className="ref">INV-LH-EXPIRED-0428 · expired 28 Apr 2026 21:14 WAT</div>
        <div className="dvm-actions" style={{ maxWidth: 320, margin: '24px auto 0' }}>
          <button type="button" className="dvm-btn">
            <span>Contact onboarding</span> <span className="arrow">→</span>
          </button>
          <button type="button" className="dvm-btn ghost">I already have an account</button>
        </div>
      </div>
    </DvmAuthShell>
  );
}

function DvmSignup({ vp, signupState = 'default' }) {
  if (signupState === 'verification_sent') return <DvmSignupVerificationSent vp={vp} />;
  if (signupState === 'invalid_invite') return <DvmSignupInvalidInvite vp={vp} />;
  return <DvmSignupForm vp={vp} state={signupState} />;
}

Object.assign(window, { DvmSignup });
