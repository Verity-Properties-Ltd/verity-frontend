// Verity — Toast
// kind: success (default) | gold | danger. Render inside <ToastRegion>.
const TOAST_GLYPH = { success: '✓', gold: '★', danger: '×' };

function Toast({ kind = 'success', title, meta, children }) {
  const cls = kind === 'gold' ? 'toast' : `toast toast-${kind}`;
  return (
    <div className={cls}>
      <span className="toast-icon">{TOAST_GLYPH[kind] || '✓'}</span>
      <div>
        {title && <strong>{title}</strong>}
        {children}
        {meta && <div className="toast-meta">{meta}</div>}
      </div>
    </div>
  );
}

function ToastRegion({ children }) {
  return <div className="toast-region">{children}</div>;
}
