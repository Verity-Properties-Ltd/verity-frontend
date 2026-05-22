export function DistributionSparkline({ values, recentDays = 8 }: { values: number[]; recentDays?: number }) {
  const cutoff = Math.max(0, values.length - recentDays);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${v}%`,
            background: i >= cutoff ? 'var(--gold)' : 'var(--gold-soft)',
            borderRadius: '1px 1px 0 0',
          }}
        />
      ))}
    </div>
  );
}
