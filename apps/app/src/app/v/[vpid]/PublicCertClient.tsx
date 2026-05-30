'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { certificateService } from '@/lib/services';
import { Brand } from '@/components/brand/Brand';
import { BandBlock } from '@/components/verification/BandBlock';
import { CertMasthead } from '@/components/certificate/CertMasthead';
import { CertProperty } from '@/components/certificate/CertProperty';
import { CertSign } from '@/components/certificate/CertSign';
import { CertFoot } from '@/components/certificate/CertFoot';
import type { Certificate } from '@/lib/types/certificate';

export function PublicCertClient({ vpid }: { vpid: string }) {
  const [cert, setCert] = useState<Certificate | null | 'loading'>('loading');

  useEffect(() => {
    let cancelled = false;
    // Try the path-cased vpid, fall back to lowercase (seeds use lowercase ids)
    (async () => {
      let c = await certificateService.get(vpid);
      if (!c) c = await certificateService.get(vpid.toLowerCase());
      if (!cancelled) setCert(c);
    })();
    return () => { cancelled = true; };
  }, [vpid]);

  return (
    <div className="public-cert-shell">
      <header className="public-cert-top">
        <Brand meta="VERIFICATION REPORT" />
        <Link href="/signup/buyer" className="bf-mono public-cert-cta">
          Verify a property →
        </Link>
      </header>

      <main style={{ padding: '32px 16px 64px' }}>
        {cert === 'loading' && (
          <p className="bf-small" style={{ textAlign: 'center', color: 'var(--slate)' }}>
            Looking up <span className="bf-mono">{vpid.toUpperCase()}</span>…
          </p>
        )}

        {cert === null && (
          <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center' }}>
            <div className="bf-eyebrow" style={{ marginBottom: 10, color: 'var(--danger)' }}>— Not found</div>
            <h1 className="bf-h1">No certificate matches <em className="bf-italic">{vpid.toUpperCase()}.</em></h1>
            <p className="bf-small" style={{ marginTop: 14 }}>
              Double-check the reference. Public certificates remain valid for 12 months from issuance.
            </p>
          </div>
        )}

        {cert && cert !== 'loading' && (
          <div className="bf-cert-letter">
            <CertMasthead vpid={cert.vpid} />
            <div className="bf-cert-grid">
              <BandBlock tier={cert.band.tier} score={cert.band.score} clarify={cert.band.clarify} />
              <CertProperty cert={cert} />
            </div>
            <hr className="bf-divider gold" style={{ margin: '32px auto' }} />
            <CertSign specialist={cert.specialist} />
            <div style={{ marginTop: 28 }}>
              <CertFoot publicUrl={cert.publicUrl} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
