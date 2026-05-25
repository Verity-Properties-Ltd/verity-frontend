'use client';

import type { VerityNG_HouseAttachment, VerityNG_HouseStyle } from '@verity/reso';

const STYLES: { id: VerityNG_HouseStyle; hint: string }[] = [
  { id: 'Bungalow', hint: 'Single-storey — RESO: SingleFamilyResidence' },
  { id: 'Duplex',   hint: 'Two-storey single-family — RESO: SingleFamilyResidence' },
  { id: 'Terrace',  hint: 'Row of attached units — RESO: Townhouse' },
];

const ATTACHMENTS: VerityNG_HouseAttachment[] = ['Detached', 'SemiDetached'];

export function HouseStyleSelector({
  style,
  attachment,
  onStyleChange,
  onAttachmentChange,
}: {
  style: VerityNG_HouseStyle | null;
  attachment: VerityNG_HouseAttachment | null;
  onStyleChange: (next: VerityNG_HouseStyle) => void;
  onAttachmentChange: (next: VerityNG_HouseAttachment) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
          House style
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 10,
          }}
        >
          {STYLES.map((s) => {
            const selected = style === s.id;
            return (
              <button
                key={s.id}
                type="button"
                className={`bf-card tier${selected ? ' selected' : ''}`}
                onClick={() => onStyleChange(s.id)}
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  minHeight: 72,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span
                  className="bf-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: selected ? 'var(--gold-deep)' : 'var(--slate)',
                  }}
                >
                  — {s.id}
                </span>
                <span className="bf-body" style={{ fontSize: 13, color: 'var(--navy)', lineHeight: 1.4 }}>
                  {s.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
          Attachment
        </div>
        <div className="bf-seg" style={{ display: 'inline-grid', gridAutoFlow: 'column', gridAutoColumns: '160px' }}>
          {ATTACHMENTS.map((a) => (
            <button
              key={a}
              type="button"
              className={attachment === a ? 'on' : ''}
              onClick={() => onAttachmentChange(a)}
            >
              {a === 'SemiDetached' ? 'Semi-Detached' : a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
