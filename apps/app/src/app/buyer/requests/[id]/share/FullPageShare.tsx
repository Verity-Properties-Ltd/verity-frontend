'use client';

import { useRouter } from 'next/navigation';
import { ShareSheet } from '@/components/certificate/ShareSheet';
import { AppBar } from '@/components/chrome/AppBar';

export function FullPageShare({ vpid }: { vpid: string }) {
  const router = useRouter();
  return (
    <>
      <div className="wizard-mobile-chrome">
        <AppBar back title="SHARE" backHref={`/requests/${vpid}/certificate`} />
      </div>
      <main className="bf-main">
        <div className="bf-main-inner" style={{ maxWidth: 520 }}>
          <ShareSheet vpid={vpid} onClose={() => router.push(`/requests/${vpid}/certificate`)} />
        </div>
      </main>
    </>
  );
}
