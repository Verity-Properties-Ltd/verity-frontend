/**
 * Verity — FormField + form atom primitives. Canonical CSS classes:
 * .field, .field-label, .req, .field-error, .field-help,
 * .input, .textarea, .select, .check, .radio, .check-row.
 */

export type FormFieldProps = {
  label?: React.ReactNode;
  required?: boolean;
  error?: React.ReactNode;
  help?: React.ReactNode;
  children: React.ReactNode;
};

export function FormField({ label, required, error, help, children }: FormFieldProps) {
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

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export function Input(props: InputProps) {
  return <input className="input" {...props} />;
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea(props: TextareaProps) {
  return <textarea className="textarea" {...props} />;
}

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export function Select({ children, ...rest }: SelectProps) {
  return (
    <select className="select" {...rest}>
      {children}
    </select>
  );
}

export type CheckboxProps = {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label: React.ReactNode;
};
export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="check-row" onClick={() => onChange && onChange(!checked)}>
      <span className={`check ${checked ? 'checked' : ''}`} />
      <span>{label}</span>
    </label>
  );
}

export type RadioProps = {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label: React.ReactNode;
};
export function Radio({ checked, onChange, label }: RadioProps) {
  return (
    <label className="check-row" onClick={() => onChange && onChange(true)}>
      <span className={`radio ${checked ? 'checked' : ''}`} />
      <span>{label}</span>
    </label>
  );
}
