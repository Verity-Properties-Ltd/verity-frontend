export default function PublicPageRoot() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'var(--f-serif)', color: 'var(--navy)', background: 'var(--cream)' }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.22em', color: 'var(--gold-deep)', textTransform: 'uppercase', marginBottom: 18 }}>
          Public verification surface
        </div>
        <h1 style={{ fontFamily: 'var(--f-serif)', fontWeight: 500, fontSize: 36, margin: 0 }}>
          A verification record lives at <code style={{ fontFamily: 'var(--f-mono)', fontSize: 24 }}>/v/&#123;VPID&#125;</code>.
        </h1>
        <p style={{ marginTop: 16, color: 'var(--slate)', maxWidth: 520, margin: '16px auto 0' }}>
          Try a fixture: <a href="/v/VRT-7K2M9PXQR8" style={{ color: 'var(--navy)', borderBottom: '1px solid var(--gold)', textDecoration: 'none' }}>/v/VRT-7K2M9PXQR8</a>.
          The route ships in Phase 5 of the consolidation plan.
        </p>
      </div>
    </main>
  );
}
