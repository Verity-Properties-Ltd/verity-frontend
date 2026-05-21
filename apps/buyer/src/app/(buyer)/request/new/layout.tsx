'use client';

import { usePathname } from 'next/navigation';
import { AppBar } from '@/components/chrome/AppBar';
import { PageHead } from '@/components/wizard/PageHead';
import { REQUEST_STEPS, StepBar } from '@/components/wizard/StepBar';
import { RequestSidebar } from '@/components/wizard/RequestSidebar';

const STEP_INFO: Record<string, { current: number; title: string }> = {
  property: { current: 0, title: 'New verification' },
  documents: { current: 1, title: 'Documents' },
  tier: { current: 2, title: 'Choose your tier' },
  payment: { current: 3, title: 'Payment' },
  confirmed: { current: 4, title: 'Submitted' },
};

export default function WizardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const seg = pathname.split('/').filter(Boolean).pop() || 'property';
  const info = STEP_INFO[seg] || STEP_INFO.property;
  const stepLabel = `${info.current + 1} OF ${REQUEST_STEPS.length}`;
  const isConfirmed = seg === 'confirmed';

  return (
    <>
      {/* Mobile chrome — only above lg */}
      <div className="wizard-mobile-chrome">
        {!isConfirmed && (
          <>
            <AppBar
              title="NEW REQUEST"
              right={<span className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>{stepLabel}</span>}
            />
            <StepBar steps={REQUEST_STEPS} current={info.current} />
          </>
        )}
      </div>

      <div className="bf-desk-split" style={{ flex: 1 }}>
        <main className="bf-main">
          <div className="bf-main-inner">
            {/* Desktop chrome — only at lg+ */}
            {!isConfirmed && (
              <div className="wizard-desktop-chrome">
                <PageHead step={`REQUEST · ${stepLabel}`} title={info.title}>
                  <StepBar steps={REQUEST_STEPS} current={info.current} />
                </PageHead>
              </div>
            )}
            {children}
          </div>
        </main>
        {!isConfirmed && (
          <aside className="bf-side">
            <RequestSidebar />
          </aside>
        )}
      </div>

    </>
  );
}
