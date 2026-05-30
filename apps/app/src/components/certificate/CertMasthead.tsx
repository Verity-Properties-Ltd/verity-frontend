export function CertMasthead({ vpid }: { vpid: string }) {
  return (
    <div className="bf-cert-mast">
      <div className="word">VERITY</div>
      <span className="gilt" />
      <div className="label">— Verification Report —</div>
      <div className="bf-mono" style={{ fontSize: 11, color: 'var(--navy)', letterSpacing: '0.18em', marginTop: 8 }}>
        {vpid.toUpperCase()}
      </div>
    </div>
  );
}
