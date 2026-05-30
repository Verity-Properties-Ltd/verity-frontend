import { DevTopbar } from '@dev/components/chrome/DevTopbar';
import { DistributeClient } from './DistributeClient';

type Search = { vpid?: string };

export default async function DistributePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { vpid } = await searchParams;
  return (
    <>
      <DevTopbar crumbs={[{ label: 'Lekki Heights Properties Ltd' }, { label: 'Distribute' }]} showSearch={false} />
      <div className="dv-content">
        <DistributeClient initialVpid={vpid} />
      </div>
    </>
  );
}
