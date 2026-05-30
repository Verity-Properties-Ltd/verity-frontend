'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VerityMark } from '@dev/components/brand/VerityMark';
import { authService } from '@dev/lib/services';

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
      <Link href="/developer" className="left" style={{ textDecoration: 'none' }}>
        <VerityMark size={20} />
        <span className="word">VERITY</span>
      </Link>
      <Link href="/developer/account" className="ava" style={{ textDecoration: 'none' }}>
        {initial}
      </Link>
    </div>
  );
}
