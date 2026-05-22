'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VerityMark } from '@/components/brand/VerityMark';
import { authService } from '@/lib/services';

export function MobileTopBar() {
  const [initial, setInitial] = useState('•');

  useEffect(() => {
    const s = authService.getSession();
    if (s) {
      setInitial(s.fullName.charAt(0).toUpperCase());
    }
  }, []);

  return (
    <div className="dv-mobile-top">
      <Link href="/dashboard" className="left" style={{ textDecoration: 'none' }}>
        <VerityMark size={20} />
        <span className="word">VERITY</span>
      </Link>
      <Link href="/account" className="ava" style={{ textDecoration: 'none' }}>
        {initial}
      </Link>
    </div>
  );
}
