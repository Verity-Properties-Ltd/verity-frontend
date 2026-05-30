import { DevRail } from '@dev/components/chrome/DevRail';
import { AuthGuard } from './AuthGuard';
import { MobileTopBar } from './MobileTopBar';
import './dev.css';

export default function DevLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="dv-app">
        <MobileTopBar />
        <div className="dv-rail-wrap">
          <DevRail />
        </div>
        <main className="dv-main">{children}</main>
      </div>
      {modal}
    </AuthGuard>
  );
}
