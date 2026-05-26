import type { PropertyStatus } from '@/lib/types/property';

const MAP: Record<PropertyStatus, { label: string; cls: string }> = {
  draft: { label: 'Draft', cls: 'draft' },
  verified: { label: 'Active', cls: 'active' },
  'in-verification': { label: 'In verification', cls: 'verifying' },
  'awaiting-docs': { label: 'Awaiting docs', cls: 'verifying' },
  expiring: { label: 'Refresh available', cls: 'refresh' },
  expired: { label: 'Expired', cls: 'expired' },
};

export function StatusPill({ status }: { status: PropertyStatus }) {
  const s = MAP[status];
  return (
    <span className={`dv-status-pill ${s.cls}`}>
      <span className="dot" />
      <span className="label">{s.label}</span>
    </span>
  );
}
