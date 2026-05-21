import type { Certificate } from '@/lib/types/certificate';

export function CertSign({ specialist }: { specialist: Certificate['specialist'] }) {
  return (
    <div className="bf-row" style={{ alignItems: 'flex-start', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div className="bf-eyebrow slate" style={{ fontSize: 9 }}>— Specialist sign-off</div>
        <div className="bf-h3" style={{ fontStyle: 'italic', fontWeight: 500, marginTop: 6 }}>{specialist.name}</div>
        <div className="bf-small" style={{ fontSize: 12, marginTop: 2 }}>{specialist.title}</div>
        <div className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.14em', marginTop: 6 }}>{specialist.regNo}</div>
        <div className="bf-mono" style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: '0.14em', marginTop: 2 }}>SIGNED · {specialist.signedAt}</div>
      </div>
      <div
        style={{
          width: 72, height: 72, borderRadius: 999,
          border: '1.5px solid var(--gold)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 4, borderRadius: 999, border: '1px dashed var(--gold)', opacity: 0.5 }} />
        <span style={{ fontFamily: 'var(--f-mark)', fontSize: 22, color: 'var(--navy)', letterSpacing: '0.05em' }}>V</span>
      </div>
    </div>
  );
}
