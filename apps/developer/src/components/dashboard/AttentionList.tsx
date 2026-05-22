import type { AttentionItem } from '@/lib/types/property';

const WARN_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 2v6m0 2.5v.5" stroke="#A88A45" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="8" r="6.5" stroke="#A88A45" strokeWidth="1.2" />
  </svg>
);

const UPGRADE_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 12V4M5 7l3-3 3 3" stroke="#5C6BC0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function AttentionList({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) {
    return (
      <div className="dv-attn-empty">
        <div className="gold-rule" />
        <div className="h">All caught up.</div>
        <div className="sub">No action items</div>
      </div>
    );
  }
  return (
    <div className="dv-attn">
      {items.map((it) => (
        <a key={it.id} className={`dv-attn-item ${it.kind}`} href={it.href || '#'}>
          <div className="icon-pad">{it.kind === 'warn' ? WARN_ICON : UPGRADE_ICON}</div>
          <div className="body">
            <div className="h">
              {it.emphasis ? <><em>{it.emphasis}</em> {it.title}</> : it.title}
            </div>
            <div className="sub">{it.sub}</div>
          </div>
          <span className="arrow">→</span>
        </a>
      ))}
    </div>
  );
}
