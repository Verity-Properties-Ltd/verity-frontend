'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services';

export function SignupForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !email.trim() || password.length < 12) {
      setError('Please complete name, email, and a 12+ character password.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.signUp({ fullName, email, phone: phone || undefined, password });
      router.push(`/signup/check-email?email=${encodeURIComponent(email)}`);
    } catch {
      setError('Could not create account. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="bf-eyebrow" style={{ marginBottom: 14 }}>— Step 01 of 02</div>
      <h2 className="bf-h1" style={{ fontSize: 40, lineHeight: 1.05 }}>
        Create your <em className="bf-italic">buyer account.</em>
      </h2>
      <p className="bf-small" style={{ marginTop: 12, fontSize: 14 }}>
        A small piece of housekeeping before we verify a property for you.
      </p>

      <div className="bf-stack" style={{ gap: 18, marginTop: 28 }}>
        <div className="bf-field">
          <label className="bf-label" htmlFor="fullName">Full name *</label>
          <input
            id="fullName"
            className="bf-input"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Adaeze Okonkwo"
          />
        </div>
        <div className="bf-field">
          <label className="bf-label" htmlFor="email">Email *</label>
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
          <label className="bf-label" htmlFor="phone">Phone (Nigerian or diaspora)</label>
          <input
            id="phone"
            className="bf-input"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+44 7700 900 124"
          />
        </div>
        <div className="bf-field">
          <label className="bf-label" htmlFor="password">Password *</label>
          <input
            id="password"
            className="bf-input"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={`bf-help${error ? ' error' : ''}`}>
            {error ?? 'Min 12 chars, with one number.'}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="bf-btn primary"
        style={{ marginTop: 24 }}
        disabled={submitting}
      >
        {submitting ? 'Creating…' : <>Continue <span className="arrow">→</span></>}
      </button>

      <p className="bf-small" style={{ marginTop: 14, textAlign: 'center', fontSize: 12 }}>
        Already verified with us? <Link href="/signin" className="bf-link">Sign in.</Link>
      </p>
    </form>
  );
}
