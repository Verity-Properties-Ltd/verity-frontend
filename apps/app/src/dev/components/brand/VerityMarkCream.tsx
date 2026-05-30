/** Cream-on-navy variant of the Verity mark for use on dark surfaces (rail, auth aside). */
export function VerityMarkCream({ size = 22 }: { size?: number }) {
  const w = Math.round((size * 44) / 50);
  return (
    <svg viewBox="0 0 44 50" width={w} height={size} style={{ flexShrink: 0 }}>
      <path
        d="M 4 0 L 40 0 Q 44 0 44 4 L 44 34 Q 44 37 41.5 38.5 L 24.5 48.3 Q 22 49.7 19.5 48.3 L 2.5 38.5 Q 0 37 0 34 L 0 4 Q 0 0 4 0 Z"
        fill="#F5F2ED"
      />
      <path
        d="M 30 7 L 37 7 L 37 14"
        stroke="#C9A961"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
