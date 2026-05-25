import type { Certificate } from '@/lib/types/certificate';

/**
 * Public-cert property card.
 *
 * Per brief §9.4, the public surface exposes the canonical RESO field
 * names verbatim (Verity_VPID / StandardStatus / PropertyType / Verity_LGA)
 * — institutional consumers (banks, valuers) read this surface directly.
 */
export function CertProperty({ cert }: { cert: Certificate }) {
  const rows: { field: string; value: string }[] = [
    { field: 'Verity_VPID',    value: cert.vpid.toUpperCase() },
  ];
  if (cert.property.plotNo) {
    rows.push({ field: 'Verity_PlotNo', value: cert.property.plotNo });
  }
  if (cert.property.PropertyType) {
    rows.push({
      field: 'PropertyType',
      value:
        cert.property.PropertySubType
          ? `${cert.property.PropertyType} · ${cert.property.PropertySubType}`
          : cert.property.PropertyType,
    });
  }
  if (cert.property.StandardStatus) {
    rows.push({ field: 'StandardStatus', value: cert.property.StandardStatus });
  }
  if (cert.property.Verity_LGA) {
    rows.push({ field: 'Verity_LGA', value: cert.property.Verity_LGA });
  }
  rows.push({ field: 'Verity_TitleIssueDate', value: cert.verifiedAt });

  return (
    <div className="bf-card" style={{ padding: 18 }}>
      <div className="bf-eyebrow slate" style={{ marginBottom: 10, fontSize: 9 }}>— Property identification · RESO</div>
      <div className="bf-h3" style={{ marginTop: 4, fontSize: 18, fontWeight: 500 }}>{cert.property.addressLine1}</div>
      <div className="bf-body" style={{ fontStyle: 'italic', color: 'var(--slate)', fontSize: 14, marginTop: 2 }}>
        {cert.property.addressLine2}, Lagos State, Nigeria
      </div>
      <hr className="bf-divider" style={{ margin: '14px 0' }} />
      <div className="bf-stack" style={{ gap: 8 }}>
        {rows.map((r) => (
          <div key={r.field} className="bf-row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span
              className="bf-mono"
              style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.16em' }}
              title={`RESO field · ${r.field}`}
            >
              {r.field}
            </span>
            <span className="bf-mono" style={{ fontSize: 12, color: 'var(--navy)', letterSpacing: '0.14em' }}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
