import { InternalAuthGuard } from './AuthGuard';
import { InternalRail } from './InternalRail';
import './internal.css';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <InternalAuthGuard>
      <div className="int-app">
        <InternalRail />
        <main className="int-main">{children}</main>
      </div>
    </InternalAuthGuard>
  );
}
