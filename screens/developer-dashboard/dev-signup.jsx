/* VERITY · Developer signup · reached via Founding 50 invite link (§4.2)

   States supported via `signupState`:
     'invalid_invite' — link is invalid or expired
     'default'        — empty form, primary button disabled
     'filled'         — form filled, ready to submit
     'submitting'     — primary button in loading state, fields disabled
     'email_exists'   — inline error on email field
     'verification_sent' — full-page email verification confirmation

   Per §4.2: signup is deliberately light — basic registration info + email
   verification only. Company KYC is NOT collected here; it's a post-signup
   step from the dashboard via the two-stage Mono flow (§4.3).
*/

function DevSignup({ signupState = 'default' }) {
  if (signupState === 'invalid_invite') return <SignupInvalidInvite/>;
  if (signupState === 'verification_sent') return <SignupVerificationSent/>;
  return <SignupForm signupState={signupState}/>;
}

/* ─── Signup form (default / filled / submitting / email_exists) ── */
function SignupForm({ signupState }) {
  const filled    = signupState === 'filled' || signupState === 'submitting' || signupState === 'email_exists';
  const submitting = signupState === 'submitting';
  const emailErr  = signupState === 'email_exists';

  return (
    <div className="dv-auth">
      {/* LEFT — brand / cohort panel */}
      <aside className="dv-auth-brand">
        <div className="head">
          <VerityMarkCream size={32}/>
          <div>
            <div className="word">VERITY</div>
            <div className="meta">Founding 50 · Cohort 014</div>
          </div>
        </div>

        <div className="quote">
          Verity verifies every developer through Mono before a property is added — a deliberate gate.
        </div>

        <div className="cohort">
          <div className="label">Welcome · invitation accepted</div>
          <h2>You’ve been <em>invited</em> to join the Founding 50.</h2>
          <p>
            Fifty Lagos developers, hand-selected by Verity’s founders, with free verification through Q3 2027 and a Founding Partner badge for your property listings.
          </p>

          <div className="credits">
            <div className="it">
              Advisor
              <span className="v">Sheun Badmus</span>
            </div>
            <div className="it">
              Admitted
              <span className="v">28 Apr 2026</span>
            </div>
            <div className="it">
              Cohort
              <span className="v">014 · 09 May</span>
            </div>
            <div className="it">
              Cohort size
              <span className="v">12 of 50 · open</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT — form */}
      <section className="dv-auth-form">
        <div className="topbar">
          <span className="step">Step 01 of 02 · Registration</span>
          <span className="lang">English · EN</span>
        </div>

        <div className="invite-strip">
          <span className="ic">✓</span>
          <div className="body">
            <div className="h">Founding 50 invitation verified</div>
            <div className="sub">Lekki Heights Properties Ltd · admitted 28 April</div>
          </div>
          <span className="ref">INV-LH-7QH3M9</span>
        </div>

        <h1>Create your <em>Verity</em> account.</h1>
        <p className="lede">
          A few basics to set up your workspace. Company verification — a CAC check and a director identity check, both via Mono — happens after you sign in.
        </p>

        <div className="dv-form">
          {/* Row 1 — name + work email */}
          <div className="row">
            <div className="dv-field">
              <label className="lbl">Primary contact · full name</label>
              <input
                className={`dv-input`}
                placeholder="e.g. Adeola Ogundipe"
                defaultValue={filled ? 'Adeola Ogundipe' : ''}
                disabled={submitting}
              />
            </div>

            <div className="dv-field">
              <label className="lbl">
                Work email
                <span className="prefilled-note"><span className="dot"></span>From your application</span>
              </label>
              <input
                className={`dv-input prefilled ${emailErr ? 'error' : ''}`}
                defaultValue="adeola@lekkiheights.ng"
                disabled={submitting}
              />
              {emailErr ? (
                <div className="help error">An account with this email already exists. <a href="#" style={{color:'var(--navy)', borderBottom:'1px solid var(--gold)', textDecoration:'none', paddingBottom:1, marginLeft:4}}>Sign in instead?</a></div>
              ) : (
                <div className="help">Pre-filled from your Founding 50 application — editable if you’d prefer a different work address.</div>
              )}
            </div>
          </div>

          {/* Row 2 — company name (full) */}
          <div className="dv-field full">
            <label className="lbl">Company name <span className="opt">As registered with CAC</span></label>
            <input
              className="dv-input"
              placeholder="e.g. Lekki Heights Properties Ltd"
              defaultValue={filled ? 'Lekki Heights Properties Ltd' : ''}
              disabled={submitting}
            />
            <div className="help">We’ll confirm this matches your CAC registration during company verification.</div>
          </div>

          {/* Row 3 — password (full) */}
          <div className="dv-field full">
            <label className="lbl">
              Password
              <span className="opt">Minimum 12 characters · mixed case · one number</span>
            </label>
            <input
              className="dv-input"
              type="password"
              placeholder="••••••••••••"
              defaultValue={filled ? '••••••••••••••' : ''}
              disabled={submitting}
            />
            {filled && (
              <>
                <div className="dv-strength">
                  <span className="seg s1"></span>
                  <span className="seg s2"></span>
                  <span className="seg s3"></span>
                  <span className="seg s4"></span>
                </div>
                <div className="dv-strength-label">Strength · <em>strong</em> · 14 characters</div>
              </>
            )}
          </div>
        </div>

        <p className="dv-auth-legal">
          By creating an account you agree to our <a href="#">Terms of Service</a> and acknowledge our <a href="#">NDPR-compliant Privacy Policy</a>. We collect no government identifiers at this stage; KYC is completed separately via Mono.
        </p>

        <div className="dv-auth-actions">
          {submitting ? (
            <button className="dv-btn primary loading">
              <span className="spinner"></span>
              Creating your account…
            </button>
          ) : (
            <button
              className={`dv-btn primary ${!filled ? 'disabled' : ''}`}
              disabled={!filled}
            >
              Create account <span className="arrow">→</span>
            </button>
          )}
          <div className="alt">
            Already have an account? <a href="#">Sign in</a>
          </div>
        </div>

        {/* Footer micro-meta */}
        <div style={{
          marginTop: 'auto', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          color: 'var(--slate-soft)', letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}>
          <span>verity.properties/signup?type=developer</span>
          <span>§4.2 · Phase 1 UI/UX</span>
        </div>
      </section>
    </div>
  );
}

/* ─── Verification-sent state — full-page confirmation ───────── */
function SignupVerificationSent() {
  return (
    <div className="dv-verify-sent">
      <div className="panel">
        <span className="corner tl"></span>
        <span className="corner tr"></span>
        <span className="corner bl"></span>
        <span className="corner br"></span>

        <div className="seal">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="6" y="9" width="24" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="#fff"/>
            <path d="M6.5 10.5 L18 19 L29.5 10.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="29" cy="9" r="4.5" fill="var(--gold)"/>
            <path d="M27 9 L28.5 10.5 L31 8" stroke="var(--navy)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="eyebrow">Step 02 of 02 · Verify your email</div>
        <h2>Check your inbox — we’ve sent a <em>verification link</em>.</h2>
        <p className="body">
          Open the email from Verity and click the link to finish creating your account. Your workspace and onboarding checklist are waiting on the other side.
        </p>

        <div className="email-pill">
          <span className="dot"></span>
          adeola@lekkiheights.ng
        </div>

        <div className="helper">
          <div className="it">
            <span className="n">01</span>
            <div className="body-t">
              Open the email from Verity
              <span className="sub">Sender: verify@verity.properties</span>
            </div>
          </div>
          <div className="it">
            <span className="n">02</span>
            <div className="body-t">
              Click the verification link
              <span className="sub">Expires in 30 minutes for security</span>
            </div>
          </div>
          <div className="it">
            <span className="n">03</span>
            <div className="body-t">
              Land on the dashboard
              <span className="sub">Where you’ll complete company verification</span>
            </div>
          </div>
          <div className="it">
            <span className="n">04</span>
            <div className="body-t">
              Add your first property
              <span className="sub">Unlocked once KYC clears — usually same day</span>
            </div>
          </div>
        </div>

        <div className="actions-row">
          <button className="dv-btn outline">Change email address</button>
          <span className="resend">
            Didn’t get it? <em>Resend</em> <span className="timer">in 0:42</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Invalid / expired invite state ─────────────────────────── */
function SignupInvalidInvite() {
  return (
    <div className="dv-invite-invalid">
      <div className="panel">
        <div className="seal">!</div>
        <div className="eyebrow">Invite link · cannot be opened</div>
        <h2>This invite link is invalid or has expired.</h2>
        <p className="body">
          For security, Founding 50 invite links expire 14 days after they’re issued and become unusable once accepted. Contact your Verity advisor for a new one.
        </p>

        <div className="ref">
          verity.properties/signup?invite=<s>INV-LH-EXPIRED-0428</s>
        </div>

        <div className="actions">
          <button className="dv-btn primary">Contact my advisor</button>
          <button className="dv-btn outline">Back to verity.properties</button>
        </div>

        <div style={{
          marginTop: 28, paddingTop: 16,
          borderTop: '1px solid var(--line)',
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          color: 'var(--slate-soft)', letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}>
          Already have an account? <a href="#" style={{color:'var(--navy)', borderBottom:'1px solid var(--gold)', paddingBottom:1, textDecoration:'none', letterSpacing:'0.18em'}}>Sign in</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  DevSignup, SignupForm, SignupVerificationSent, SignupInvalidInvite,
});
