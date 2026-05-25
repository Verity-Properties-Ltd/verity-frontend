'use client';

import type { VerityNG_BQConfig } from '@/lib/types/reso';

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
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: 14,
          background: '#fff',
          border: '1px solid var(--line)',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={hasBQ}
          onChange={(e) => onHasBQChange(e.target.checked)}
          style={{ marginTop: 2 }}
        />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, color: 'var(--navy)', fontWeight: 500 }}>
            This property includes a Boys&apos; Quarters
          </span>
          <span style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.4 }}>
            Captured as <code style={{ fontFamily: 'var(--f-meta)', fontSize: 11 }}>Verity_NG_HasBQ</code>.
          </span>
        </span>
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
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CONFIGS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onConfigChange(c)}
                  className={`dv-chip${bqConfig === c ? ' active' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: 12,
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={bqSeparateTitle}
              onChange={(e) => onSeparateTitleChange(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, color: 'var(--navy)' }}>BQ has a separate C of O</span>
              <span style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.4 }}>
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
