/**
 * Renders a RESO/Verity field name as a small mono pill next to its
 * human label. Use `variant="ng"` for Verity_NG_* fields (teal-tinted).
 *
 * Per brief §9.5: the verbatim field name is visible — preserving RESO
 * PascalCase exactly so engineers can map UI to API field names at sight.
 */
export function ResoTag({
  field,
  variant = field.startsWith('Verity_NG_') ? 'ng' : 'std',
}: {
  field: string;
  variant?: 'std' | 'ng';
}) {
  return (
    <span className={`reso-tag${variant === 'ng' ? ' ng' : ''}`} title={`RESO field · ${field}`}>
      {field}
    </span>
  );
}
