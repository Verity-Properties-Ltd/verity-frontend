'use client';

import type { VerityNG_HouseAttachment, VerityNG_HouseStyle } from '@/lib/types/reso';

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
          style={{
            fontFamily: 'var(--f-meta)',
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
                onClick={() => onStyleChange(s.id)}
                style={{
                  background: '#fff',
                  border: selected ? '1px solid var(--gold)' : '1px solid var(--line)',
                  boxShadow: selected ? '0 0 0 1px var(--gold) inset' : undefined,
                  padding: 12,
                  borderRadius: 6,
                  textAlign: 'left',
                  cursor: 'pointer',
                  minHeight: 70,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--f-meta)',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: selected ? 'var(--gold-deep)' : 'var(--slate)',
                  }}
                >
                  — {s.id}
                </span>
                <span style={{ fontSize: 12, color: 'var(--navy)', lineHeight: 1.4 }}>{s.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

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
          Attachment
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ATTACHMENTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onAttachmentChange(a)}
              className={`dv-chip${attachment === a ? ' active' : ''}`}
            >
              {a === 'SemiDetached' ? 'Semi-Detached' : a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
