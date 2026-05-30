// Verity — Table (dense data table)
// columns: [{ key, label, mono?, num?, sortable? }]
// rows: [{ ...cellsByKey, _band?, _expiring?:[keys] }]
// render(col, row) optional custom cell via column.render
function Table({ columns = [], rows = [], selectable = false, selected = [], onSelect }) {
  return (
    <table className={`vtable${selectable ? ' selectable' : ''}`}>
      <thead>
        <tr>
          {selectable && <th className="cbx"></th>}
          {columns.map((c) => (
            <th key={c.key} className={c.sortable ? 'sortable' : ''}>
              {c.label}{c.sortable && <span className="sort-arrow"> ↓</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const isSel = selected.includes(i);
          return (
            <tr key={i} className={isSel ? 'selected' : ''}>
              {selectable && (
                <td className="cbx">
                  <span className={`check${isSel ? ' on' : ''}`} onClick={() => onSelect && onSelect(i)}></span>
                </td>
              )}
              {columns.map((c) => {
                const cls = [c.mono ? 'mono' : '', c.num ? 'num' : '', (row._expiring || []).includes(c.key) ? 'td-expiring' : ''].filter(Boolean).join(' ');
                return <td key={c.key} className={cls}>{c.render ? c.render(row[c.key], row) : row[c.key]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
