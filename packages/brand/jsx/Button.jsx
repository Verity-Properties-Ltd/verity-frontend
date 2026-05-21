// Verity — Button
// variants: primary | secondary | tertiary | gold | danger
// sizes: sm | md | lg
// props: dark (for dark surfaces), iconOnly, disabled, onClick, children
function Button({ variant = 'primary', size = 'md', dark = false, iconOnly = false, disabled = false, className = '', children, ...rest }) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' && 'btn-sm',
    size === 'lg' && 'btn-lg',
    iconOnly && 'btn-icon',
    dark && 'dark-bg',
    className
  ].filter(Boolean).join(' ');
  return <button className={cls} disabled={disabled} {...rest}>{children}</button>;
}
