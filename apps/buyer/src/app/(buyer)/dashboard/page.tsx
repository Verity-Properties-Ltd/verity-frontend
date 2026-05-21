import Link from 'next/link';
import { DashboardClient } from './DashboardClient';

export default function DashboardPage() {
  return (
    <>
      <DashboardClient />
      <noscript>
        <div style={{ padding: 24 }}>
          <p className="bf-small">JavaScript is required to view your dashboard.</p>
          <Link href="/request/new/property" className="bf-link">Start a new verification</Link>
        </div>
      </noscript>
    </>
  );
}
