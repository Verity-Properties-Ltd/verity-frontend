'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShareSheet } from '@/components/certificate/ShareSheet';

export function ShareModal({ vpid }: { vpid: string }) {
  const router = useRouter();
  const close = () => router.back();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bf-share-backdrop" onClick={close}>
      <div className="bf-share-shell" onClick={(e) => e.stopPropagation()}>
        <div className="bf-share-grip" aria-hidden />
        <ShareSheet vpid={vpid} onClose={close} />
      </div>
    </div>
  );
}
