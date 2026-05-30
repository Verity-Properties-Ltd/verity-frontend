import { DesktopRail } from '@/components/chrome/DesktopRail';
import { AuthGuard } from './AuthGuard';
import './buyer.css';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="buyer-shell">
        <DesktopRail />
        <div className="buyer-body">{children}</div>
      </div>
    </AuthGuard>
  );
}
