type Lockup = { id: 'light-stacked' | 'dark-stacked' | 'light-horizontal'; label: string };

const LOCKUPS: Lockup[] = [
  { id: 'light-stacked', label: 'LIGHT · STACKED' },
  { id: 'dark-stacked', label: 'DARK · STACKED' },
  { id: 'light-horizontal', label: 'LIGHT · HORIZONTAL' },
];

function StackedLight() {
  return (
    <div style={{ border: '1px solid var(--gold)', padding: '14px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: '#fff' }}>
      <div style={{ fontFamily: 'var(--f-meta)', fontSize: 8, color: 'var(--gold-deep)', letterSpacing: '0.28em' }}>FOUNDING 50</div>
      <div style={{ fontFamily: 'var(--f-mark)', fontSize: 14, color: 'var(--navy)', letterSpacing: '0.22em' }}>VERITY</div>
      <div style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 11, color: 'var(--slate)' }}>Verified developer · 2026</div>
    </div>
  );
}

function StackedDark() {
  return (
    <div style={{ border: '1px solid var(--gold)', padding: '14px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--navy-deep)' }}>
      <div style={{ fontFamily: 'var(--f-meta)', fontSize: 8, color: 'var(--gold)', letterSpacing: '0.28em' }}>FOUNDING 50</div>
      <div style={{ fontFamily: 'var(--f-mark)', fontSize: 14, color: 'var(--cream)', letterSpacing: '0.22em' }}>VERITY</div>
      <div style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 11, color: 'rgba(245,242,237,0.6)' }}>Verified developer · 2026</div>
    </div>
  );
}

function Horizontal() {
  return (
    <div style={{ border: '1px solid var(--gold)', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 14, background: '#fff' }}>
      <div style={{ fontFamily: 'var(--f-mark)', fontSize: 14, color: 'var(--navy)', letterSpacing: '0.22em', borderRight: '1px solid var(--line)', paddingRight: 14 }}>VERITY</div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontFamily: 'var(--f-meta)', fontSize: 8, color: 'var(--gold-deep)', letterSpacing: '0.22em' }}>FOUNDING 50</div>
        <div style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 11, color: 'var(--slate)' }}>Verified developer · 2026</div>
      </div>
    </div>
  );
}

const LOCKUP_RENDERERS: Record<Lockup['id'], () => React.ReactNode> = {
  'light-stacked': StackedLight,
  'dark-stacked': StackedDark,
  'light-horizontal': Horizontal,
};

export function BadgeLockups() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginTop: 8 }} className="dv-badge-grid">
      {LOCKUPS.map((l) => {
        const Renderer = LOCKUP_RENDERERS[l.id];
        const bg = l.id === 'dark-stacked' ? 'var(--navy-deep)' : 'var(--cream-shade)';
        const labelColor = l.id === 'dark-stacked' ? 'var(--gold)' : 'var(--slate)';
        return (
          <div key={l.id} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 24, border: '1px solid var(--line)', background: bg, borderRadius: 4, alignItems: 'center' }}>
            <Renderer />
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: labelColor, letterSpacing: '0.18em' }}>
              {l.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
