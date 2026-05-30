export default function LandingPlaceholder() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'var(--f-serif)', color: 'var(--navy)', background: 'var(--cream)' }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.22em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 18 }}>
          In build — Phase 2
        </div>
        <h1 style={{ fontFamily: 'var(--f-serif)', fontWeight: 500, fontSize: 36, margin: 0 }}>
          Landing is being migrated from the mvp repo.
        </h1>
        <p style={{ marginTop: 16, color: 'var(--slate)', maxWidth: 520, margin: '16px auto 0' }}>
          The teaser at verity.properties currently serves from <code>Verity-Properties-Ltd/mvp</code>. The
          Phase 2 task in the consolidation plan moves it here, rebuilt against design system tokens.
        </p>
      </div>
    </main>
  );
}
