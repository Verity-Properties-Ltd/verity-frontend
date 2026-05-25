'use client';

import type { VerityNG_BQConfig } from '@verity/reso';

const CONFIGS: { id: VerityNG_BQConfig; tip: string }[] = [
  { id: 'Attached', tip: 'Inside the main building' },
  { id: 'Detached', tip: 'Standalone unit on the same plot' },
  { id: 'Rooftop',  tip: 'On the rooftop level' },
];

export function BQToggle({
  hasBQ,
  bqConfig,
  bqSeparateTitle,
  onHasBQChange,
  onConfigChange,
  onSeparateTitleChange,
}: {
  hasBQ: boolean;
  bqConfig: VerityNG_BQConfig | null;
  bqSeparateTitle: boolean;
  onHasBQChange: (next: boolean) => void;
  onConfigChange: (next: VerityNG_BQConfig) => void;
  onSeparateTitleChange: (next: boolean) => void;
}) {
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
        <div style={{ paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--f-meta)',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--slate)',
                marginBottom: 8,
              }}
            >
              BQ configuration
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
            </div>
          </div>

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
              <span style={{ fontSize: 12, color: 'var(--gold-deep)', lineHeight: 1.5 }}>
                <strong>Additional verification underway.</strong> The BQ title document must be uploaded and
                verified independently. Our analyst team will reach out within 24 hours.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
