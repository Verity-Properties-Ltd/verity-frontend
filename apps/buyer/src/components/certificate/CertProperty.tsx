import type { Certificate } from '@/lib/types/certificate';

export function CertProperty({ cert }: { cert: Certificate }) {
  const rows: [string, string][] = [
    ['VPID', cert.vpid.toUpperCase()],
    ...(cert.property.plotNo ? ([['PLOT NO.', cert.property.plotNo]] as [string, string][]) : []),
    ['TYPE', cert.property.type],
    ['VERIFIED', cert.verifiedAt],
  ];
  return (
    <div className="bf-card" style={{ padding: 18 }}>
      <div className="bf-eyebrow slate" style={{ marginBottom: 10, fontSize: 9 }}>— Property identification</div>
      <div className="bf-h3" style={{ marginTop: 4, fontSize: 18, fontWeight: 500 }}>{cert.property.addressLine1}</div>
      <div className="bf-body" style={{ fontStyle: 'italic', color: 'var(--slate)', fontSize: 14, marginTop: 2 }}>
        {cert.property.addressLine2}, Lagos State, Nigeria
      </div>
      <hr className="bf-divider" style={{ margin: '14px 0' }} />
      <div className="bf-stack" style={{ gap: 8 }}>
        {rows.map(([k, v]) => (
          <div key={k} className="bf-row" style={{ justifyContent: 'space-between' }}>
            <span className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.2em' }}>{k}</span>
            <span className="bf-mono" style={{ fontSize: 12, color: 'var(--navy)', letterSpacing: '0.14em' }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
