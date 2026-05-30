'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { kycService } from '@dev/lib/services';

export function FullPageProve() {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);

  async function onContinue() {
    if (completing) return;
    setCompleting(true);
    await kycService.openProveSession();
    await new Promise((r) => setTimeout(r, 1200));
    kycService.completeStage2();
    router.replace('/developer');
  }

  return (
    <div className="dv-content" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="dv-prove-eyebrow">Mono Prove · Tier 2 identity</div>
      <h2 className="dv-prove-title">
        Verify your identity as the <em>registering director</em>.
      </h2>
      <p className="dv-prove-desc">
        Direct visit (no in-app navigation). In production this opens the Mono Prove hosted widget. For the prototype, click Continue to simulate a successful capture.
      </p>

      <ol className="dv-prove-steps">
        <li><span className="n">01</span><div>BVN or NIN entry<span className="desc">Masked in our UI to the last three digits.</span></div></li>
        <li><span className="n">02</span><div>ID document capture<span className="desc">Driver&rsquo;s licence, NIN card, or international passport.</span></div></li>
        <li><span className="n">03</span><div>Selfie + liveness<span className="desc">Three head-turn prompts.</span></div></li>
        <li><span className="n">04</span><div>Consent<span className="desc">Permission to verify against NIMC.</span></div></li>
      </ol>

      <div className="dv-prove-footer">
        <button type="button" className="dv-btn ghost" onClick={() => router.replace('/developer')} disabled={completing}>
          Back to dashboard
        </button>
        <button type="button" className={`dv-btn gold${completing ? ' loading' : ''}`} onClick={onContinue} disabled={completing}>
          {completing ? <><span className="spinner" /> Verifying…</> : <>Continue <span className="arrow">→</span></>}
        </button>
      </div>
    </div>
  );
}
