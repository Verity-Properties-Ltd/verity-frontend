/**
 * Verity — VPID + VPR identifier displays. Always DM Mono.
 *
 * VPID format per PRD §4.2: VRT-XXXXXXXXX (12 chars, Base-36 + Luhn).
 * VPR format per PRD §4.3: VPR-YYYY-NNNNNN.
 *
 * Trust-critical domain primitive — any change to formatting, font, or
 * copy-on-click behaviour requires founder review (PRD §11.2).
 */
export type VpidProps = {
  id: string;
  copyable?: boolean;
  label?: React.ReactNode;
};

export function Vpid({ id, copyable = false, label }: VpidProps) {
  function copy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(id);
    }
  }
  const pill = (
    <span className="vpid">
      {id}
      {copyable && (
        <button className="vpid-copy" onClick={copy} title="Copy VPID" aria-label="Copy VPID" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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

export function Vpr({ children }: { children: React.ReactNode }) {
  return (
    <span className="vpr">
      <strong>{children}</strong>
    </span>
  );
}
