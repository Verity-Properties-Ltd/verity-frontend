import type { SalesMetadata } from '@/lib/types/property';

export function SalesMetadataCard({ sales }: { sales: SalesMetadata }) {
  const rows: [string, string][] = [
    ['Internal reference', sales.reference],
    ['Sales status', sales.status],
    ['List price', sales.listPrice || '—'],
    ['Buyer', sales.buyer || '—'],
    ['Notes', sales.notes || '—'],
  ];
  return (
    <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: 22 }}>
      <div style={{ fontFamily: 'var(--f-mark)', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 14 }}>
        Sales metadata
      </div>
      {rows.map(([k, v], i) => (
        <div key={k} style={{ padding: '10px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none' }}>
          <div style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>{k}</div>
          <div style={{ fontSize: 13, color: 'var(--navy)', marginTop: 4 }}>{v}</div>
        </div>
      ))}
      <button type="button" className="dv-btn outline" style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
        Edit metadata
      </button>
    </div>
  );
}
