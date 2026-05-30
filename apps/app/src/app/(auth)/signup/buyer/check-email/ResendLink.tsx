'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/services';

export function ResendLink({ email }: { email?: string }) {
  const [cooldown, setCooldown] = useState(42);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function onResend() {
    if (!email || cooldown > 0 || sending) return;
    setSending(true);
    await authService.requestEmailLink(email);
    setSending(false);
    setCooldown(42);
  }

  const ready = cooldown <= 0 && !!email && !sending;
  const label = sending
    ? 'sending…'
    : cooldown > 0
      ? `resend in 0:${cooldown.toString().padStart(2, '0')}`
      : 'resend link';

  return (
    <p className="bf-small" style={{ textAlign: 'center' }}>
      Didn&apos;t receive it? Check spam, or{' '}
      <a
        className="bf-link"
        onClick={onResend}
        style={{ opacity: ready ? 1 : 0.55, cursor: ready ? 'pointer' : 'default' }}
      >
        {label}
      </a>
      .
    </p>
  );
}
