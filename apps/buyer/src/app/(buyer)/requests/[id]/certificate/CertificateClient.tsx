'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { certificateService } from '@/lib/services';
import { AppBar } from '@/components/chrome/AppBar';
import { BandBlock } from '@/components/verification/BandBlock';
import { CertMasthead } from '@/components/certificate/CertMasthead';
import { CertProperty } from '@/components/certificate/CertProperty';
import { CertSign } from '@/components/certificate/CertSign';
import { CertFoot } from '@/components/certificate/CertFoot';
import type { Certificate } from '@/lib/types/certificate';

export function CertificateClient({ vpid }: { vpid: string }) {
  const [cert, setCert] = useState<Certificate | null | 'loading'>('loading');

  useEffect(() => {
    let cancelled = false;
    certificateService.get(vpid).then((c) => {
      if (!cancelled) setCert(c);
    });
    return () => { cancelled = true; };
  }, [vpid]);

  if (cert === 'loading') {
    return <div className="bf-main-inner" style={{ color: 'var(--slate)' }}>Loading certificate…</div>;
  }
  if (cert === null) {
    return (
      <div className="bf-main-inner">
        <h1 className="bf-page-h1">Certificate not available</h1>
        <p className="bf-small" style={{ marginTop: 12 }}>
          The request <span className="bf-mono">{vpid}</span> isn&apos;t complete yet, so no certificate has been issued.
        </p>
        <Link href={`/requests/${vpid}`} className="bf-link" style={{ display: 'inline-block', marginTop: 16 }}>
          Back to status →
        </Link>
      </div>
    );
  }

  const titleRight = (
    <span className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>
      {cert.vpid.toUpperCase()}
    </span>
  );

  return (
    <>
      <div className="wizard-mobile-chrome">
        <AppBar back title="CERTIFICATE" right={titleRight} backHref={`/requests/${vpid}`} />
      </div>

      <main className="bf-main">
        <div className="bf-main-inner" style={{ maxWidth: 820 }}>
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

            <div className="bf-cert-actions">
              <button type="button" className="bf-btn outline" style={{ width: 'auto', minWidth: 140 }}>
                Download
              </button>
              <Link href={`/requests/${vpid}/share`} className="bf-btn gold" style={{ width: 'auto', minWidth: 200, textDecoration: 'none' }}>
                Share <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
