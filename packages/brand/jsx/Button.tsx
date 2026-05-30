/**
 * Verity — Button. Canonical .btn / .btn-{variant} primitive.
 *
 * Canonical CSS: components.css — .btn, .btn-primary, .btn-secondary,
 * .btn-tertiary, .btn-gold, .btn-danger, .btn-sm, .btn-lg, .btn-icon,
 * .btn.dark-bg.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'gold' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  dark?: boolean;
  iconOnly?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export function Button({
  variant = 'primary',
  size = 'md',
  dark = false,
  iconOnly = false,
  disabled = false,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' && 'btn-sm',
    size === 'lg' && 'btn-lg',
    iconOnly && 'btn-icon',
    dark && 'dark-bg',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
