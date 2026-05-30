// Verity — Banner
// Full-width, page-level status. kind: info | warning | danger | success
function Banner({ kind = 'info', action, onAction, children }) {
  return (
    <div className={`banner banner-${kind}`}>
      <div className="banner-body">{children}</div>
      {action && <span className="banner-action" onClick={onAction}>{action}</span>}
    </div>
  );
}
