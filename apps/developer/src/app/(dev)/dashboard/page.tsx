import { DevTopbar } from '@/components/chrome/DevTopbar';
import { DashboardClient } from './DashboardClient';

export default function DashboardPage() {
  return (
    <>
      <DevTopbar crumbs={[{ label: 'Lekki Heights Properties Ltd' }, { label: 'Dashboard' }]} showSearch={false} />
      <div className="dv-content">
        <DashboardClient />
      </div>
    </>
  );
}
