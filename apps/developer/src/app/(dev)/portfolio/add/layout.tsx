'use client';

import { usePathname } from 'next/navigation';
import { DevTopbar } from '@/components/chrome/DevTopbar';
import { PageHead } from '@/components/chrome/PageHead';
import { WizardModeToggle } from '@/components/wizard/WizardModeToggle';
import { WizardSide } from '@/components/wizard/WizardSide';
import { ADD_STEPS, type StepSlug } from '@/lib/types/add';

export default function AddLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = (pathname.split('/').pop() || 'type') as StepSlug;
  const isCsv = pathname.startsWith('/portfolio/add/csv');
  const stepInfo = ADD_STEPS.find((s) => s.slug === slug);

  const eyebrow = isCsv ? 'Bulk import' : stepInfo ? `Step ${stepInfo.num} of ${String(ADD_STEPS.length).padStart(2, '0')} · ${stepInfo.label}` : 'Add property';

  return (
    <>
      <DevTopbar
        crumbs={[
          { label: 'Lekki Heights Properties Ltd' },
          { label: 'Portfolio' },
          { label: 'Add property' },
        ]}
        showSearch={false}
      />
      <div className="dv-content">
        <PageHead
          eyebrow={eyebrow}
          title={<>Add a <em>property</em></>}
          lede="Submit a single property for verification, or batch up to 25 in one workflow."
        />

        <WizardModeToggle />

        {isCsv ? children : (
          <div className="dv-wizard">
            <WizardSide currentSlug={slug} />
            <div>{children}</div>
          </div>
        )}
      </div>
    </>
  );
}
