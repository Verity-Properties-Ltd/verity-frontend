'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services';

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
      router.push('/dashboard');
    } catch {
      setError('Could not sign in. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="bf-eyebrow" style={{ marginBottom: 14 }}>— Welcome back</div>
      <h2 className="bf-h1" style={{ fontSize: 40, lineHeight: 1.05 }}>
        Sign in to <em className="bf-italic">your account.</em>
      </h2>
      <p className="bf-small" style={{ marginTop: 12, fontSize: 14 }}>
        Open your dashboard, track a verification, or share a certificate.
      </p>

      <div className="bf-stack" style={{ gap: 18, marginTop: 28 }}>
        <div className="bf-field">
          <label className="bf-label" htmlFor="email">Email</label>
          <input
            id="email"
            className="bf-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adaeze.o@gmail.com"
          />
        </div>
        <div className="bf-field">
          <label className="bf-label" htmlFor="password">Password</label>
          <input
            id="password"
            className="bf-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="bf-help error">{error}</div>}
        </div>
      </div>

      <button type="submit" className="bf-btn primary" style={{ marginTop: 24 }} disabled={submitting}>
        {submitting ? 'Signing in…' : <>Sign in <span className="arrow">→</span></>}
      </button>

      <p className="bf-small" style={{ marginTop: 14, textAlign: 'center', fontSize: 12 }}>
        New to Verity? <Link href="/signup" className="bf-link">Create an account.</Link>
      </p>
    </form>
  );
}
