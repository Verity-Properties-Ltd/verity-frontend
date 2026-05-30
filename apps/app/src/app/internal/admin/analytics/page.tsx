import { InProgressShell } from '../../InProgressShell';

export default function AnalyticsPage() {
  return (
    <InProgressShell
      storyId="SUP-04"
      title="Platform Analytics"
      description="Leadership view of volume, revenue, operations, funnel — exportable for board reporting. The four North Stars from PRD §12.1 surface here in real time."
      spec="UI/UX v1.3 §7.4 Super Admin · Analytics · PRD §12 Success Metrics."
      acceptanceCriteria={[
        'Volume: monthly verification count vs target trajectory (50, 150, 350, 500, 700, 800/mo).',
        'Quality: verified-band dispute rate, refund rate on Platinum/Gold (target <0.5%).',
        'Speed: p50, p95, p99 turnaround per tier; VPID issuance latency.',
        'Distribution: bank pilots in evaluation, API queries/month, insurance conversations.',
        'Exports: CSV + PDF, board-ready monthly snapshot.',
      ]}
    />
  );
}
