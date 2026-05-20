// Verity — Pagination
function Pagination({ page = 1, total = 1, onChange }) {
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pages.push(i);
    if (page < total - 2) pages.push('…');
    pages.push(total);
  }
  return (
    <div className="pagination">
      <span className={`pg ${page === 1 ? 'disabled' : ''}`} onClick={() => page > 1 && onChange(page - 1)}>‹</span>
      {pages.map((p, i) => (
        <span
          key={i}
          className={`pg ${p === page ? 'active' : ''} ${p === '…' ? 'disabled' : ''}`}
          onClick={() => typeof p === 'number' && onChange(p)}
        >{p}</span>
      ))}
      <span className={`pg ${page === total ? 'disabled' : ''}`} onClick={() => page < total && onChange(page + 1)}>›</span>
    </div>
  );
}
