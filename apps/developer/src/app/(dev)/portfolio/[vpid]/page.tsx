import { DevTopbar } from '@/components/chrome/DevTopbar';
import { PropertyDetailClient } from './PropertyDetailClient';

export default async function PropertyPage({ params }: { params: Promise<{ vpid: string }> }) {
  const { vpid } = await params;
  return (
    <>
      <DevTopbar crumbs={[{ label: 'Lekki Heights Properties Ltd' }, { label: 'Portfolio' }, { label: vpid.toUpperCase() }]} showSearch={false} />
      <div className="dv-content">
        <PropertyDetailClient vpid={vpid} />
      </div>
    </>
  );
}
