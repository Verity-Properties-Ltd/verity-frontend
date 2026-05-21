// Verity — Tabs + Breadcrumbs
function Tabs({ value, options = [], onChange }) {
  return (
    <div className="tabs">
      {options.map(opt => (
        <span
          key={opt}
          className={`tab ${value === opt ? 'active' : ''}`}
          onClick={() => onChange && onChange(opt)}
        >{opt}</span>
      ))}
    </div>
  );
}

function Breadcrumbs({ items = [] }) {
  return (
    <div className="breadcrumbs">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          {i === items.length - 1
            ? <span className="here">{it.label}</span>
            : <a href={it.href || '#'}>{it.label}</a>}
        </React.Fragment>
      ))}
    </div>
  );
}
