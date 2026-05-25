'use client';

const BED_CHIPS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5+' },
];

const BATH_FULL_CHIPS = BED_CHIPS;

const BATH_HALF_CHIPS = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3+' },
];

const HALF_BATH_HELP =
  'A half bath has a sink and toilet but no shower or tub — sometimes called a guest toilet or powder room.';

export function BedsBathsSelector({
  showBedrooms,
  showHalfBaths,
  bedrooms,
  bathroomsFull,
  bathroomsHalf,
  onBedroomsChange,
  onBathroomsFullChange,
  onBathroomsHalfChange,
}: {
  showBedrooms: boolean;
  showHalfBaths: boolean;
  bedrooms: number | null;
  bathroomsFull: number | null;
  bathroomsHalf: number | null;
  onBedroomsChange: (next: number) => void;
  onBathroomsFullChange: (next: number) => void;
  onBathroomsHalfChange: (next: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showBedrooms && (
        <ChipGroup label="Bedrooms">
          {BED_CHIPS.map((b) => (
            <ChipButton
              key={b.value}
              active={bedrooms === b.value}
              onClick={() => onBedroomsChange(b.value)}
            >
              {b.label}
            </ChipButton>
          ))}
        </ChipGroup>
      )}

      <ChipGroup label="Full bathrooms">
        {BATH_FULL_CHIPS.map((b) => (
          <ChipButton
            key={b.value}
            active={bathroomsFull === b.value}
            onClick={() => onBathroomsFullChange(b.value)}
          >
            {b.label}
          </ChipButton>
        ))}
      </ChipGroup>

      {showHalfBaths && (
        <ChipGroup label="Half bathrooms" optional help={HALF_BATH_HELP}>
          {BATH_HALF_CHIPS.map((b) => (
            <ChipButton
              key={b.value}
              active={bathroomsHalf === b.value}
              onClick={() => onBathroomsHalfChange(b.value)}
            >
              {b.label}
            </ChipButton>
          ))}
        </ChipGroup>
      )}
    </div>
  );
}

function ChipGroup({
  label,
  help,
  optional,
  children,
}: {
  label: string;
  help?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--f-meta)',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--slate)',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span>{label}</span>
        {optional && <span style={{ color: 'var(--slate-soft)' }}>· optional</span>}
        {help && <HelpDot title={help} />}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{children}</div>
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`dv-chip${active ? ' active' : ''}`}
      style={{ minWidth: 44, justifyContent: 'center' }}
    >
      {children}
    </button>
  );
}

function HelpDot({ title }: { title: string }) {
  return (
    <span
      title={title}
      role="img"
      aria-label={title}
      tabIndex={0}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 14,
        height: 14,
        borderRadius: '50%',
        border: '1px solid var(--slate)',
        color: 'var(--slate)',
        fontSize: 9,
        fontWeight: 600,
        cursor: 'help',
        fontFamily: 'var(--f-meta)',
        lineHeight: 1,
      }}
    >
      ?
    </span>
  );
}
