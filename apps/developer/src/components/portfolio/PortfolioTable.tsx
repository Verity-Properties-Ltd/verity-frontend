'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BandPill } from '@/components/dashboard/BandPill';
import { StatusPill } from './StatusPill';
import { BulkBar } from './BulkBar';
import type { PropertySummary } from '@/lib/types/property';

function isExpiryWarning(p: PropertySummary): boolean {
  return p.status === 'expiring' || p.status === 'expired';
}

function PropertyTagRow({ p }: { p: PropertySummary }) {
  const tags: React.ReactNode[] = [];
  if (p.Verity_NG_HouseStyle) tags.push(<span key="hs" className="tag">{p.Verity_NG_HouseStyle}</span>);
  if (p.Verity_NG_ApartmentStyle) tags.push(<span key="as" className="tag">{p.Verity_NG_ApartmentStyle}</span>);
  if (p.Verity_NG_LandZoning) tags.push(<span key="lz" className="tag">{p.Verity_NG_LandZoning}</span>);
  if (p.Verity_NG_LandFeature && p.Verity_NG_LandFeature !== 'None') {
    tags.push(<span key="lf" className="badge badge-gold">{p.Verity_NG_LandFeature}</span>);
  }
  if (p.Verity_NG_HasBQ) tags.push(<span key="bq" className="badge-bq">Includes BQ</span>);
  if (tags.length === 0) return null;
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{tags}</div>;
}

export function PortfolioTable({ properties }: { properties: PropertySummary[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleOne(vpid: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(vpid)) next.delete(vpid);
      else next.add(vpid);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === properties.length ? new Set() : new Set(properties.map((p) => p.vpid))));
  }

  function onBulkAction(id: string) {
    const ids = Array.from(selected);
    console.info('[mock] bulk action', id, ids);
  }

  return (
    <>
      <BulkBar count={selected.size} onAction={onBulkAction} />

      <div className="dv-table-wrap">
        <table className="dv-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <span
                  className={`check${selected.size === properties.length && properties.length > 0 ? ' on' : ''}`}
                  onClick={toggleAll}
                  role="checkbox"
                  aria-checked={selected.size === properties.length}
                  tabIndex={0}
                />
              </th>
              <th>Property <span className="sort">↕</span></th>
              <th>VPID</th>
              <th>Band</th>
              <th>Last verified <span className="sort">↕</span></th>
              <th>Expiry <span className="sort">↕</span></th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.vpid}>
                <td>
                  <span
                    className={`check${selected.has(p.vpid) ? ' on' : ''}`}
                    onClick={() => toggleOne(p.vpid)}
                    role="checkbox"
                    aria-checked={selected.has(p.vpid)}
                    tabIndex={0}
                  />
                </td>
                <td className="addr">
                  {p.status === 'draft' ? (
                    <Link
                      href={`/portfolio/add/type?draft=${p.vpid}`}
                      className="name"
                      style={{ color: 'var(--navy)', textDecoration: 'none', borderBottom: '1px dashed var(--gold-soft)' }}
                    >
                      {p.address || 'Untitled draft'}
                    </Link>
                  ) : (
                    <div className="name">{p.address}</div>
                  )}
                  {p.ref && <div className="ref">REF · {p.ref}</div>}
                  <PropertyTagRow p={p} />
                </td>
                <td className="vpid">{p.vpid}</td>
                <td><BandPill band={p.band} /></td>
                <td className="date">{p.verifiedAt || '—'}</td>
                <td className={`date${isExpiryWarning(p) ? ' warn' : ''}`}>{p.expiresAt || '—'}</td>
                <td><StatusPill status={p.status} /></td>
                <td className="act"><span className="more">⋯</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
