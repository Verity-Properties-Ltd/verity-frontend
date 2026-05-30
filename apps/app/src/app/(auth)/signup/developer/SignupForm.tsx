'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService, EmailExistsError } from '@dev/lib/services';
import type { InviteStatus } from '@dev/lib/types/auth';

type SignupState = 'default' | 'filled' | 'submitting' | 'email_exists';

function strengthOf(password: string): number {
  if (password.length < 8) return 0;
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABEL = ['too weak', 'weak', 'fair', 'good', 'strong'] as const;

export function SignupForm({ initialInvite }: { initialInvite?: string }) {
  const router = useRouter();
  const [invite, setInvite] = useState<InviteStatus | null>(null);
  const [inviteLoading, setInviteLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState<SignupState>('default');

  useEffect(() => {
    if (!initialInvite) {
      setInvite({ kind: 'valid', company: 'Lekki Heights Properties Ltd', admittedAt: '28 April', ref: 'INV-LH-7QH3M9' });
      setInviteLoading(false);
      return;
    }
    let cancelled = false;
    authService.validateInvite(initialInvite).then((status) => {
      if (cancelled) return;
      if (status.kind === 'valid') {
        setInvite(status);
        setCompanyName((c) => c || status.company);
      } else {
        router.replace('/signup/developer/invalid');
      }
      setInviteLoading(false);
    });
    return () => { cancelled = true; };
  }, [initialInvite, router]);

  const allFilled = fullName.trim() && email.trim() && companyName.trim() && password.length >= 12;
  const computedState: SignupState = state === 'submitting' || state === 'email_exists'
    ? state
    : allFilled ? 'filled' : 'default';

  const strength = strengthOf(password);
  const emailErr = computedState === 'email_exists';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!invite || invite.kind !== 'valid' || !allFilled || state === 'submitting') return;
    setState('submitting');
    try {
      await authService.signUp({ fullName, email, companyName, password, inviteCode: invite.ref });
      router.push(`/signup/check-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof EmailExistsError) {
        setState('email_exists');
      } else {
        setState('default');
      }
    }
  }

  if (inviteLoading) {
    return <div className="lede">Validating invite…</div>;
  }
  if (!invite || invite.kind !== 'valid') {
    return null;
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="topbar">
        <span className="step">Step 01 of 02 · Registration</span>
        <span className="lang">English · EN</span>
      </div>

      <div className="invite-strip">
        <span className="ic">✓</span>
        <div className="body">
          <div className="h">Founding 50 invitation verified</div>
          <div className="sub">{invite.company} · admitted {invite.admittedAt}</div>
        </div>
        <span className="ref">{invite.ref}</span>
      </div>

      <h1>Create your <em>Verity</em> account.</h1>
      <p className="lede">
        A few basics to set up your workspace. Company verification — a CAC check and a director identity check, both via Mono — happens after you sign in.
      </p>

      <div className="dv-form">
        <div className="row">
          <div className="dv-field">
            <label className="lbl" htmlFor="fullName">Primary contact · full name</label>
            <input
              id="fullName"
              className="dv-input"
              placeholder="e.g. Adeola Ogundipe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={state === 'submitting'}
              autoComplete="name"
            />
          </div>

          <div className="dv-field">
            <label className="lbl" htmlFor="email">
              Work email
              <span className="prefilled-note"><span className="dot" />From your application</span>
            </label>
            <input
              id="email"
              className={`dv-input prefilled${emailErr ? ' error' : ''}`}
              type="email"
              placeholder="you@company.ng"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === 'email_exists') setState('default'); }}
              disabled={state === 'submitting'}
              autoComplete="email"
            />
            {emailErr ? (
              <div className="help error">
                An account with this email already exists.{' '}
                <Link href="/signin/developer" style={{ color: 'var(--navy)', borderBottom: '1px solid var(--gold)', textDecoration: 'none', paddingBottom: 1, marginLeft: 4 }}>
                  Sign in instead?
                </Link>
              </div>
            ) : (
              <div className="help">Pre-filled from your Founding 50 application — editable if you&rsquo;d prefer a different work address.</div>
            )}
          </div>
        </div>

        <div className="dv-field full">
          <label className="lbl" htmlFor="companyName">
            Company name <span className="opt">As registered with CAC</span>
          </label>
          <input
            id="companyName"
            className="dv-input"
            placeholder="e.g. Lekki Heights Properties Ltd"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={state === 'submitting'}
            autoComplete="organization"
          />
          <div className="help">We&rsquo;ll confirm this matches your CAC registration during company verification.</div>
        </div>

        <div className="dv-field full">
          <label className="lbl" htmlFor="password">
            Password
            <span className="opt">Minimum 12 characters · mixed case · one number</span>
          </label>
          <input
            id="password"
            className="dv-input"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={state === 'submitting'}
            autoComplete="new-password"
          />
          {password.length > 0 && (
            <>
              <div className="dv-strength">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={`seg${strength >= i ? ` on-s${strength}` : ''}`} />
                ))}
              </div>
              <div className="dv-strength-label">
                Strength · <em>{STRENGTH_LABEL[strength]}</em> · {password.length} characters
              </div>
            </>
          )}
        </div>
      </div>

      <p className="dv-auth-legal">
        By creating an account you agree to our <a href="#">Terms of Service</a> and acknowledge our{' '}
        <a href="#">NDPR-compliant Privacy Policy</a>. We collect no government identifiers at this stage; KYC is completed separately via Mono.
      </p>

      <div className="dv-auth-actions">
        {state === 'submitting' ? (
          <button type="submit" className="dv-btn primary loading">
            <span className="spinner" />
            Creating your account…
          </button>
        ) : (
          <button type="submit" className={`dv-btn primary${computedState === 'default' ? ' disabled' : ''}`} disabled={computedState === 'default'}>
            Create account <span className="arrow">→</span>
          </button>
        )}
        <div className="alt">
          Already have an account? <Link href="/signin/developer">Sign in</Link>
        </div>
      </div>
    </form>
  );
}
