'use client';

import type { VerityNG_BQConfig } from '@verity/reso';

const CONFIGS: { id: VerityNG_BQConfig; tip: string }[] = [
  { id: 'Attached', tip: 'Inside the main building' },
  { id: 'Detached', tip: 'Standalone unit on the same plot' },
  { id: 'Rooftop',  tip: 'On the rooftop level' },
];

const BQ_BED_CHIPS  = [0, 1, 2, 3, 4].map((v) => ({ value: v, label: v === 4 ? '4+' : String(v) }));
const BQ_FULL_CHIPS = [0, 1, 2].map((v) => ({ value: v, label: v === 2 ? '2+' : String(v) }));
const BQ_HALF_CHIPS = [0, 1].map((v) => ({ value: v, label: v === 1 ? '1+' : String(v) }));

const HALF_BATH_HELP =
  'A half bath has a sink and toilet but no shower or tub — sometimes called a guest toilet or powder room.';

export function BQToggle({
  hasBQ,
  bqConfig,
  bqSeparateTitle,
  bqBedrooms,
  bqBathFull,
  bqBathHalf,
  onHasBQChange,
  onConfigChange,
  onSeparateTitleChange,
  onBQBedroomsChange,
  onBQBathFullChange,
  onBQBathHalfChange,
}: {
  hasBQ: boolean;
  bqConfig: VerityNG_BQConfig | null;
  bqSeparateTitle: boolean;
  bqBedrooms: number | null;
  bqBathFull: number | null;
  bqBathHalf: number | null;
  onHasBQChange: (next: boolean) => void;
  onConfigChange: (next: VerityNG_BQConfig) => void;
  onSeparateTitleChange: (next: boolean) => void;
  onBQBedroomsChange: (next: number) => void;
  onBQBathFullChange: (next: number) => void;
  onBQBathHalfChange: (next: number) => void;
}) {
  const showsLargeBQWarning =
    bqBedrooms !== null && bqBedrooms >= 3 && !bqSeparateTitle;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          background: '#fff',
          border: hasBQ ? '1px solid var(--gold)' : '1px solid var(--line)',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 14,
          color: 'var(--navy)',
          width: 'fit-content',
          minWidth: 260,
        }}
      >
        <input
          type="checkbox"
          checked={hasBQ}
          onChange={(e) => onHasBQChange(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: 'var(--navy)' }}
        />
        Includes Boys&apos; Quarters
      </label>

      {hasBQ && (
        <div style={{ paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ChipGroup label="BQ configuration">
            {CONFIGS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onConfigChange(c.id)}
                title={c.tip}
                className={`dv-chip${bqConfig === c.id ? ' active' : ''}`}
              >
                {c.id}
              </button>
            ))}
          </ChipGroup>

          <ChipGroup label="Bedrooms in BQ">
            {BQ_BED_CHIPS.map((b) => (
              <ChipButton
                key={b.value}
                active={bqBedrooms === b.value}
                onClick={() => onBQBedroomsChange(b.value)}
              >
                {b.label}
              </ChipButton>
            ))}
          </ChipGroup>

          <ChipGroup label="Full bathrooms in BQ">
            {BQ_FULL_CHIPS.map((b) => (
              <ChipButton
                key={b.value}
                active={bqBathFull === b.value}
                onClick={() => onBQBathFullChange(b.value)}
              >
                {b.label}
              </ChipButton>
            ))}
          </ChipGroup>

          <ChipGroup label="Half bathrooms in BQ" optional help={HALF_BATH_HELP}>
            {BQ_HALF_CHIPS.map((b) => (
              <ChipButton
                key={b.value}
                active={bqBathHalf === b.value}
                onClick={() => onBQBathHalfChange(b.value)}
              >
                {b.label}
              </ChipButton>
            ))}
          </ChipGroup>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              background: '#fff',
              border: bqSeparateTitle ? '1px solid var(--gold)' : '1px solid var(--line)',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
              color: 'var(--navy)',
              width: 'fit-content',
              minWidth: 260,
            }}
          >
            <input
              type="checkbox"
              checked={bqSeparateTitle}
              onChange={(e) => onSeparateTitleChange(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: 'var(--navy)' }}
            />
            BQ has a separate C of O
          </label>

          {bqSeparateTitle && (
            <AmberCallout>
              <strong>Additional verification underway.</strong> The BQ title document must be uploaded and
              verified independently. Our analyst team will reach out within 24 hours.
            </AmberCallout>
          )}

          {showsLargeBQWarning && (
            <AmberCallout>
              <strong>Heads up — large BQ.</strong> A Boys&apos; Quarters with 3+ bedrooms may be separately
              titled. Our analyst will verify with you whether it&apos;s included in the main C of O.
            </AmberCallout>
          )}
        </div>
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

function AmberCallout({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 14px',
        background: 'rgba(201,169,97,0.10)',
        border: '1px solid var(--gold-soft)',
        borderRadius: 4,
      }}
    >
      <span
        style={{
          flex: '0 0 auto',
          width: 16,
          height: 16,
          borderRadius: 999,
          background: 'var(--gold-deep)',
          color: '#fff',
          fontFamily: 'var(--f-meta)',
          fontSize: 10,
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        !
      </span>
      <span style={{ fontSize: 12, color: 'var(--gold-deep)', lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}
