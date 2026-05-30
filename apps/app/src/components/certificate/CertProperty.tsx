import type { Certificate } from '@/lib/types/certificate';

/**
 * Public-cert property card.
 *
 * Per Adoption Brief §9.4 and Address Capture v1 §13, the public
 * verification surface only carries the locality subset of address
 * fields (no street number / street name / unit number / plot number /
 * lat-lng). The shown labels are RESO field names verbatim — institutional
 * consumers read this surface directly.
 */
export function CertProperty({ cert }: { cert: Certificate }) {
  const p = cert.property;

  // Compose a single locality line for the heading from the safe subset.
  const localityLine = [p.Verity_NG_Neighborhood, p.City, p.CountyOrParish ? `${p.CountyOrParish} LGA` : null, p.StateOrProvince]
    .filter(Boolean)
    .join(', ');

  const rows: { field: string; value: string }[] = [];
  rows.push({ field: 'Verity_VPID', value: cert.vpid.toUpperCase() });
  if (p.PropertyType) {
    rows.push({
      field: 'PropertyType',
      value: p.PropertySubType ? `${p.PropertyType} · ${p.PropertySubType}` : p.PropertyType,
    });
  }
  if (p.StandardStatus) rows.push({ field: 'StandardStatus', value: p.StandardStatus });
  if (p.City)            rows.push({ field: 'City', value: p.City });
  if (p.CountyOrParish)  rows.push({ field: 'CountyOrParish', value: p.CountyOrParish });
  if (p.StateOrProvince) rows.push({ field: 'StateOrProvince', value: p.StateOrProvince });
  if (p.PostalCode)      rows.push({ field: 'PostalCode', value: p.PostalCode });
  if (p.Verity_NG_Neighborhood)
    rows.push({ field: 'Verity_NG_Neighborhood', value: p.Verity_NG_Neighborhood });
  rows.push({ field: 'Verity_TitleIssueDate', value: cert.verifiedAt });

  return (
    <div className="bf-card" style={{ padding: 18 }}>
      <div className="bf-eyebrow slate" style={{ marginBottom: 10, fontSize: 9 }}>— Property identification · RESO</div>
      {localityLine && (
        <>
          <div className="bf-h3" style={{ marginTop: 4, fontSize: 18, fontWeight: 500 }}>{localityLine}</div>
          <div className="bf-body" style={{ fontStyle: 'italic', color: 'var(--slate)', fontSize: 14, marginTop: 2 }}>
            Lagos State, Nigeria
          </div>
        </>
      )}
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
