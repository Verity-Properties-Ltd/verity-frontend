'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { kycService } from '@dev/lib/services';

export function ProveModal() {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);

  function close() { router.back(); }

  async function onContinue() {
    if (completing) return;
    setCompleting(true);
    await kycService.openProveSession();
    // Simulate the Mono widget capturing ID/selfie/liveness, then return success.
    await new Promise((r) => setTimeout(r, 1200));
    kycService.completeStage2();
    router.back();
    // Hard-refresh the dashboard so the state-machine renderer picks up `verified`.
    setTimeout(() => router.refresh(), 50);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !completing) close(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completing]);

  return (
    <div className="dv-modal-backdrop" onClick={() => !completing && close()}>
      <div className="dv-modal-shell" onClick={(e) => e.stopPropagation()}>
        <div className="dv-modal-grip" aria-hidden />
        <div className="dv-prove-eyebrow">Mono Prove · Tier 2 identity</div>
        <h2 className="dv-prove-title">
          Verify your identity as the <em>registering director</em>.
        </h2>
        <p className="dv-prove-desc">
          In production this opens the Mono Prove hosted widget. For the prototype, the steps below are illustrative — click Continue to simulate a successful capture.
        </p>

        <ol className="dv-prove-steps">
          <li>
            <span className="n">01</span>
            <div>BVN or NIN entry
              <span className="desc">Masked to the last three digits in our UI (e.g. ***901). Verity never stores the full number.</span>
            </div>
          </li>
          <li>
            <span className="n">02</span>
            <div>ID document capture
              <span className="desc">Driver&rsquo;s licence, NIN card, or international passport.</span>
            </div>
          </li>
          <li>
            <span className="n">03</span>
            <div>Selfie + liveness
              <span className="desc">Three head-turn prompts to confirm a real person.</span>
            </div>
          </li>
          <li>
            <span className="n">04</span>
            <div>Consent
              <span className="desc">Permission to verify against the National Identity Management Commission registry.</span>
            </div>
          </li>
        </ol>

        <div className="dv-prove-footer">
          <button type="button" className="dv-btn ghost" onClick={close} disabled={completing}>
            Cancel
          </button>
          <button type="button" className={`dv-btn gold${completing ? ' loading' : ''}`} onClick={onContinue} disabled={completing}>
            {completing ? <><span className="spinner" /> Verifying…</> : <>Continue <span className="arrow">→</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}
