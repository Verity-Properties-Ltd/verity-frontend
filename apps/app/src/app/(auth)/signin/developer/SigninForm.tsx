'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@dev/lib/services';

export function SigninForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.signIn(email, password);
      router.push('/developer');
    } catch {
      setError('Could not sign in. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="topbar">
        <span className="step">Sign in to your workspace</span>
        <span className="lang">English · EN</span>
      </div>

      <h1>Welcome <em>back</em>.</h1>
      <p className="lede">
        Sign in to your developer workspace. Your portfolio, verification history, and distribution surfaces are waiting.
      </p>

      <div className="dv-form">
        <div className="dv-field full">
          <label className="lbl" htmlFor="email">Work email</label>
          <input
            id="email"
            className="dv-input"
            type="email"
            placeholder="you@company.ng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="dv-field full">
          <label className="lbl" htmlFor="password">Password</label>
          <input
            id="password"
            className="dv-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <div className="help error">{error}</div>}
        </div>
      </div>

      <div className="dv-auth-actions">
        <button type="submit" className="dv-btn primary" disabled={submitting}>
          {submitting ? 'Signing in…' : <>Sign in <span className="arrow">→</span></>}
        </button>
        <div className="alt">
          Need an invite? <Link href="/signup/developer">Create account</Link>
        </div>
      </div>
    </form>
  );
}
