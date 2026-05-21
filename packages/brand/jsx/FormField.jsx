// Verity — FormField, Input, Textarea, Select
function FormField({ label, required, error, help, children }) {
  return (
    <div className={`field ${error ? 'error' : ''}`}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">REQUIRED</span>}
        </label>
      )}
      {children}
      {error && <span className="field-error">{error}</span>}
      {help && !error && <span className="field-help">{help}</span>}
    </div>
  );
}

function Input(props) { return <input className="input" {...props} />; }
function Textarea(props) { return <textarea className="textarea" {...props} />; }
function Select({ children, ...rest }) { return <select className="select" {...rest}>{children}</select>; }

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="check-row" onClick={() => onChange && onChange(!checked)}>
      <span className={`check ${checked ? 'checked' : ''}`}></span>
      <span>{label}</span>
    </label>
  );
}

function Radio({ checked, onChange, label }) {
  return (
    <label className="check-row" onClick={() => onChange && onChange(true)}>
      <span className={`radio ${checked ? 'checked' : ''}`}></span>
      <span>{label}</span>
    </label>
  );
}
