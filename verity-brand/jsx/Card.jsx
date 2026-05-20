// Verity — Card
function Card({ dark = false, eyebrow, title, sub, meta, children }) {
  return (
    <div className={`card ${dark ? 'dark' : ''}`}>
      {eyebrow && <div className="card-eyebrow">{eyebrow}</div>}
      {title && <div className="card-title">{title}</div>}
      {sub && <div className="card-sub">{sub}</div>}
      {children && <div className="card-body">{children}</div>}
      {meta && <div className="card-meta">{meta.map((m,i) => <span key={i}>{m}</span>)}</div>}
    </div>
  );
}
