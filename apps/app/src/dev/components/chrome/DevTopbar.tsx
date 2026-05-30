import { Fragment } from 'react';

type Crumb = { label: string; href?: string };

export function DevTopbar({
  crumbs = [],
  showSearch = true,
}: {
  crumbs?: Crumb[];
  showSearch?: boolean;
}) {
  return (
    <div className="dv-topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? 'here' : ''}>{c.label}</span>
          </Fragment>
        ))}
      </div>
      <div className="controls">
        {showSearch && (
          <div className="search">
            <span className="ic">⌕</span>
            <input placeholder="Search properties, VPIDs, or addresses…" />
          </div>
        )}
        <button type="button" className="icon-btn" aria-label="Notifications">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 6.5a5 5 0 0110 0V10l1 1.5H2L3 10V6.5zM6 13a2 2 0 004 0" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className="dot" />
        </button>
        <button type="button" className="icon-btn" aria-label="Help">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6.5 6.2a1.5 1.5 0 113 .3c0 1-1.5 1.2-1.5 2.2M8 11.3v.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
