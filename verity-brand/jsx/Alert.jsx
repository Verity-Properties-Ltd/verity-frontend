// Verity — Alert
// kind: info | success | warning | danger
const ALERT_GLYPH = { info: 'i', success: '✓', warning: '!', danger: '×' };

function Alert({ kind = 'info', title, children }) {
  return (
    <div className={`alert alert-${kind}`}>
      <span className="alert-icon">{ALERT_GLYPH[kind]}</span>
      <div>
        {title && <strong>{title}</strong>}
        {children}
      </div>
    </div>
  );
}
