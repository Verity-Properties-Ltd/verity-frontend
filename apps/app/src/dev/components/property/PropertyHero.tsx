import Link from 'next/link';
import { BandPill } from '@dev/components/dashboard/BandPill';
import { ResoTag } from './ResoTag';
import type { PropertyDetail } from '@dev/lib/types/property';

export function PropertyHero({ property }: { property: PropertyDetail }) {
  const isActive = property.status === 'verified';
  const statusLabel = property.status === 'verified' ? 'ACTIVE' : property.status === 'expired' ? 'EXPIRED' : property.status === 'expiring' ? 'EXPIRING' : 'IN VERIFICATION';
  const statusColor = isActive ? '#4F8F4F' : property.status === 'expired' ? '#B07A4A' : 'var(--gold-deep)';

  return (
    <div className="dv-prop-hero">
      <div className="row">
        <div>
          {property.ref && <div className="ref">REF · {property.ref} · Internal</div>}
          <h2><em>{property.address.split(' · ')[0]}</em>{property.address.includes(' · ') ? ` · ${property.address.split(' · ').slice(1).join(' · ')}` : ''}</h2>
          <div style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 16, color: 'var(--slate)', marginTop: 6 }}>
            {property.cityLong} · {property.sizeSqm.toLocaleString()} sqm · {property.type}
          </div>
          <div className="meta-row">
            <div>
              <span style={{ color: 'var(--slate)' }}>VPID · </span>
              <span className="v" style={{ fontWeight: 500 }}>{property.vpid}</span>
              <ResoTag field="Verity_VPID" />
            </div>
            {property.PropertyType && (
              <div>
                <span style={{ color: 'var(--slate)' }}>TYPE · </span>
                <span className="v">{property.PropertyType}{property.PropertySubType ? ` · ${property.PropertySubType}` : ''}</span>
                <ResoTag field="PropertyType" />
              </div>
            )}
            <div><span style={{ color: 'var(--slate)' }}>VERIFIED · </span><span className="v">{(property.verifiedAt || '—').toUpperCase()}</span></div>
            <div><span style={{ color: 'var(--slate)' }}>EXPIRES · </span><span className="v">{(property.expiresAt || '—').toUpperCase()}</span></div>
            <div><span style={{ color: 'var(--slate)' }}>STATUS · </span><span className="v" style={{ color: statusColor }}>● {statusLabel}</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
          <BandPill band={property.band} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" className="dv-btn outline">⟲ Refresh</button>
            <Link href={`/distribute?vpid=${property.vpid}`} className="dv-btn outline">↗ Distribute</Link>
            <Link href={`/v/${property.vpid.toLowerCase()}`} className="dv-btn primary" target="_blank">View certificate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
