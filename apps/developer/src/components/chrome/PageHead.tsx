export function PageHead({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="dv-pagehead">
      <div className="row">
        <div>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1>{title}</h1>
          {lede && <div className="lede">{lede}</div>}
        </div>
        {actions && <div className="actions">{actions}</div>}
      </div>
    </div>
  );
}
