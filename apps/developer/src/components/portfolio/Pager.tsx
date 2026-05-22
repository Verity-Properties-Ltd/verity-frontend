/** Phase 2.B: UI-only pager. Real pagination ships when propertyService.list supports it. */
export function Pager({ shown, total, pages = 8, activePage = 1 }: { shown: number; total: number; pages?: number; activePage?: number }) {
  const visiblePages = [1, 2, 3, '…', pages] as const;
  return (
    <div className="dv-pager">
      <span>Showing 1–{shown} of {total}</span>
      <div className="pages">
        {visiblePages.map((p, i) => (
          <span key={i} className={`pg${p === activePage ? ' active' : ''}`}>{p}</span>
        ))}
        <span className="pg">›</span>
      </div>
    </div>
  );
}
