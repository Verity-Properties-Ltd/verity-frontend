export function CertFoot({ publicUrl }: { publicUrl: string }) {
  return (
    <>
      <hr className="bf-divider" />
      <div className="bf-row" style={{ marginTop: 14, gap: 14, alignItems: 'flex-start' }}>
        <div className="bf-qr" aria-hidden />
        <div style={{ flex: 1 }}>
          <div className="bf-mono" style={{ fontSize: 9, color: 'var(--slate)', letterSpacing: '0.22em' }}>PUBLIC URL — SHARE-SAFE</div>
          <div className="bf-mono" style={{ fontSize: 12, color: 'var(--navy)', letterSpacing: '0.06em', marginTop: 6, lineHeight: 1.4, wordBreak: 'break-all' }}>
            {publicUrl}
          </div>
          <div className="bf-small" style={{ fontStyle: 'italic', fontSize: 11, marginTop: 6 }}>
            Type this directly into your browser to confirm authenticity.
          </div>
        </div>
      </div>
      <hr className="bf-divider" style={{ marginTop: 14 }} />
      <p className="bf-small" style={{ fontSize: 11, lineHeight: 1.55, color: 'var(--slate)', marginTop: 12 }}>
        Issued by Verity Property Technologies Ltd. (RC 7842910). This certificate reflects data as of the verification date and is valid for 12 months.
      </p>
    </>
  );
}
