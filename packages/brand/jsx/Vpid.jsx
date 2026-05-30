// Verity — VPID & VPR displays (always DM Mono)
// VPID: VRT-XXXXXXXXX · VPR: VPR-YYYY-XXXXXX
function Vpid({ id, copyable = false, label }) {
  function copy() { if (navigator.clipboard) navigator.clipboard.writeText(id); }
  const pill = (
    <span className="vpid">
      {id}
      {copyable && (
        <button className="vpid-copy" onClick={copy} title="Copy VPID" aria-label="Copy VPID">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="11" height="11" rx="1.5" />
            <path d="M5 15V5a1 1 0 0 1 1-1h9" />
          </svg>
        </button>
      )}
    </span>
  );
  if (!label) return pill;
  return (
    <div className="vpid-display">
      <span className="vpid-label">{label}</span>
      {pill}
    </div>
  );
}

function Vpr({ children }) {
  return <span className="vpr"><strong>{children}</strong></span>;
}
