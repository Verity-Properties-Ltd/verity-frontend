export function KvRow({
  k,
  v,
  mono,
  editLabel,
}: {
  k: string;
  v: React.ReactNode;
  mono?: boolean;
  editLabel?: string;
}) {
  return (
    <div className="dv-kv">
      <span className="k">{k}</span>
      <span className={`v${mono ? ' mono' : ''}`}>{v}</span>
      {editLabel ? <span className="edit">{editLabel}</span> : <span />}
    </div>
  );
}
