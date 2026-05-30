'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AppBar({
  back = true,
  title,
  right,
  backHref,
}: {
  back?: boolean;
  title?: string;
  right?: React.ReactNode;
  backHref?: string;
}) {
  const router = useRouter();
  return (
    <div className="bf-appbar">
      <div className="left">
        {back && (
          <button
            type="button"
            className="bf-icon"
            aria-label="Back"
            style={{ marginLeft: -4, background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
            onClick={() => (backHref ? router.push(backHref) : router.back())}
          >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path d="M7.5 1L1.5 7l6 6" stroke="#1E2260" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <Link href="/buyer" className="word" style={{ textDecoration: 'none' }}>
          {title || 'VERITY'}
        </Link>
      </div>
      <div className="right">{right}</div>
    </div>
  );
}
