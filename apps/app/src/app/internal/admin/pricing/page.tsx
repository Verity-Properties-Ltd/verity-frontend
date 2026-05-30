import { InProgressShell } from '../../InProgressShell';

export default function PricingPage() {
  return (
    <InProgressShell
      storyId="SUP-02"
      title="Pricing & Plans"
      description="Manage buyer-tier prices (Standard ₦50,000 / Premium ₦150,000) and developer subscription tiers post-Founding-50. Per PRD §14.2 the developer side has no per-property tier picker — pricing here governs subscription only."
      spec="UI/UX v1.3 §7.4 Super Admin · Configuration & Commerce · PRD §14.2 pricing model."
      acceptanceCriteria={[
        'Buyer tier editor: Standard / Premium with price, SLA target, maximum confidence band cap.',
        'Developer subscription editor: tier name, monthly price, included verification volume, overage rate (post-Founding-50 only).',
        'Effective-date scheduling — price changes go live at a future date, current price stays until then.',
        'Audit trail of every price change with actor + reason.',
        'Founding 50 cohort terms (free through Q3 2027) visible but not editable from here.',
      ]}
    />
  );
}
