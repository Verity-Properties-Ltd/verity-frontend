export default function Home() {
  return (
    <main style={{ padding: 'var(--s8, 40px)', maxWidth: 720, margin: '0 auto' }}>
      <div
        style={{
          fontFamily: 'var(--f-mark)',
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'var(--slate)',
          textTransform: 'uppercase',
        }}
      >
        — Verity · Developer · Phase 0
      </div>
      <h1
        style={{
          fontFamily: 'var(--f-display)',
          fontWeight: 500,
          fontSize: 48,
          lineHeight: 1.1,
          margin: '12px 0 16px',
          color: 'var(--navy)',
        }}
      >
        Workspace is alive.
      </h1>
      <p style={{ color: 'var(--slate)', fontSize: 18, lineHeight: 1.5 }}>
        Brand tokens loaded. Phase 1 ships <code>/signup</code> and the cohort-aware onboarding.
      </p>
    </main>
  );
}
