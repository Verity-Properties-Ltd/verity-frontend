export function PageHead({
  eyebrow,
  step,
  title,
  children,
}: {
  eyebrow?: React.ReactNode;
  step?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="bf-pagehead">
      {step && <div className="bf-mono" style={{ fontSize: 10, color: 'var(--gold-deep)', letterSpacing: '0.22em' }}>{step}</div>}
      {eyebrow && <div className="bf-eyebrow">— {eyebrow}</div>}
      <h1 className="bf-page-h1">{title}</h1>
      {children}
    </header>
  );
}
