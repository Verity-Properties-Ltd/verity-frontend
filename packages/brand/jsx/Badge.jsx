// Verity — Badge + Tag
// kinds: verified | pending | revoked | info | gold | neutral | solid
function Badge({ kind = 'neutral', children }) {
  return <span className={`badge badge-${kind}`}>{children}</span>;
}

function Tag({ removable = false, onRemove, children }) {
  return (
    <span className="tag" style={{ cursor: removable ? 'pointer' : 'default' }}>
      {children}
      {removable && <span onClick={onRemove} style={{ marginLeft:4, color:'#6B6F77' }}>×</span>}
    </span>
  );
}
