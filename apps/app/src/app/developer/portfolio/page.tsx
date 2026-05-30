import { DevTopbar } from '@dev/components/chrome/DevTopbar';
import { PortfolioClient } from './PortfolioClient';

export default function PortfolioPage() {
  return (
    <>
      <DevTopbar crumbs={[{ label: 'Lekki Heights Properties Ltd' }, { label: 'Portfolio' }]} />
      <div className="dv-content">
        <PortfolioClient />
      </div>
    </>
  );
}
