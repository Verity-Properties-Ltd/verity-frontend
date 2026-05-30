'use client';

const ACTIONS = [
  { id: 'refresh', label: '⟲ Refresh' },
  { id: 'distribute', label: '↗ Distribute' },
  { id: 'export', label: '⤓ Export CSV' },
  { id: 'archive', label: '⌫ Archive' },
] as const;

export function BulkBar({ count, onAction }: { count: number; onAction?: (id: string) => void }) {
  if (count === 0) return null;
  return (
    <div className="dv-bulkbar">
      <span className="ct">{count} SELECTED</span>
      <span style={{ fontSize: 13, color: 'rgba(245,242,237,0.78)' }}>
        Apply an action to all selected properties.
      </span>
      <div className="actions">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            className="ba"
            onClick={() => onAction?.(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
