'use client';

import { useState } from 'react';

export function CopyButton({ onCopy, label, className = 'dv-btn primary sm' }: { onCopy: () => Promise<unknown>; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function click() {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button type="button" className={className} onClick={click}>
      {copied ? 'Copied' : label}
    </button>
  );
}
