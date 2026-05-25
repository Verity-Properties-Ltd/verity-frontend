'use client';

import type { VerityNG_BQConfig } from '@verity/reso';

const CONFIGS: VerityNG_BQConfig[] = ['Attached', 'Detached', 'Rooftop'];

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <label className="bf-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
        <span className={`bf-check${hasBQ ? ' on' : ''}`} role="checkbox" aria-checked={hasBQ}>
          <input
            type="checkbox"
            checked={hasBQ}
            onChange={(e) => onHasBQChange(e.target.checked)}
            style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
          />
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className="bf-body" style={{ fontSize: 14, color: 'var(--navy)', fontWeight: 500 }}>
            This property includes a Boys&apos; Quarters
          </span>
          <span className="bf-small" style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.4 }}>
            Captured as <code style={{ fontFamily: 'var(--f-mono)', fontSize: 11 }}>Verity_NG_HasBQ</code>.
          </span>
        </span>
      </label>

      {hasBQ && (
        <div style={{ paddingLeft: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div
              className="bf-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--slate)',
                marginBottom: 8,
              }}
            >
              BQ configuration
            </div>
            <div className="bf-seg" style={{ display: 'inline-grid', gridAutoFlow: 'column', gridAutoColumns: '120px' }}>
              {CONFIGS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={bqConfig === c ? 'on' : ''}
                  onClick={() => onConfigChange(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <label className="bf-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <span className={`bf-check${bqSeparateTitle ? ' on' : ''}`} role="checkbox" aria-checked={bqSeparateTitle}>
              <input
                type="checkbox"
                checked={bqSeparateTitle}
                onChange={(e) => onSeparateTitleChange(e.target.checked)}
                style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
              />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="bf-body" style={{ fontSize: 13, color: 'var(--navy)' }}>BQ has a separate C of O</span>
              <span className="bf-small" style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.4 }}>
                Triggers a separate title-verification workflow.
              </span>
            </span>
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
                  fontFamily: 'var(--f-mono)',
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
              <span className="bf-body" style={{ fontSize: 12, color: 'var(--gold-deep)', lineHeight: 1.5 }}>
                <strong>Additional verification underway.</strong> The BQ title document must be uploaded
                and verified independently. Our analyst team will reach out within 24 hours.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
