/**
 * Verity — Logo (mark + lockups). Canonical ES-module surface.
 *
 * The sibling Logo.jsx uses the `Object.assign(window, ...)` global-injection
 * pattern from the original HTML showcase and is kept for reference. Apps
 * import the typed exports from this .tsx.
 */
export type VerityMarkProps = {
  size?: number;
  fill?: string;
  tick?: string;
};

export function VerityMark({ size = 44, fill = '#1E2260', tick = '#C9A961' }: VerityMarkProps) {
  return (
    <svg
      width={size}
      height={size * (50 / 44)}
      viewBox="0 0 44 50"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 4 0 L 40 0 Q 44 0 44 4 L 44 34 Q 44 37 41.5 38.5 L 24.5 48.3 Q 22 49.7 19.5 48.3 L 2.5 38.5 Q 0 37 0 34 L 0 4 Q 0 0 4 0 Z"
        fill={fill}
      />
      <path d="M 30 7 L 37 7 L 37 14" stroke={tick} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export type VerityWordmarkProps = {
  size?: number;
  color?: string;
  tickColor?: string;
};

export function VerityWordmark({
  size = 28,
  color = '#1E2260',
  tickColor = '#C9A961',
}: VerityWordmarkProps) {
  return (
    <span style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: size, letterSpacing: '0.06em', color }}>
      VERI<span style={{ color: tickColor }}>T</span>Y
    </span>
  );
}

export type VerityLogoProps = {
  variant?: 'horizontal' | 'mark' | 'wordmark' | 'stacked';
  dark?: boolean;
  tagline?: boolean;
  size?: number;
};

export function VerityLogo({
  variant = 'horizontal',
  dark = false,
  tagline = false,
  size = 28,
}: VerityLogoProps) {
  const fill = dark ? '#F5F2ED' : '#1E2260';
  const tagColor = dark ? '#C9A961' : '#A88A45';
  const markSize = size * 1.2;

  if (variant === 'mark') return <VerityMark size={markSize} fill={fill} />;
  if (variant === 'wordmark') return <VerityWordmark size={size} color={fill} />;
  if (variant === 'stacked') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <VerityMark size={markSize * 1.3} fill={fill} />
        <VerityWordmark size={size * 0.75} color={fill} />
      </div>
    );
  }
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        <VerityMark size={markSize} fill={fill} />
        <VerityWordmark size={size} color={fill} />
      </div>
      {tagline && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginLeft: markSize + 12 }}>
          <span style={{ height: 1, width: 24, background: '#C9A961', opacity: 0.6 }} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: size * 0.55, color: tagColor }}>
            the truth behind every title.
          </span>
        </div>
      )}
    </div>
  );
}
