import { DevTopbar } from '@/components/chrome/DevTopbar';
import { AccountClient } from './AccountClient';

export default function AccountPage() {
  return (
    <>
      <DevTopbar crumbs={[{ label: 'Lekki Heights Properties Ltd' }, { label: 'Account & billing' }]} showSearch={false} />
      <div className="dv-content">
        <AccountClient />
      </div>
    </>
  );
}
