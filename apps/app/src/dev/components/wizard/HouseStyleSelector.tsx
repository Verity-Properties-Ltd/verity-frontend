'use client';

import type { VerityNG_HouseAttachment, VerityNG_HouseStyle } from '@verity/reso';

const STYLES: { id: VerityNG_HouseStyle; tip: string }[] = [
  { id: 'Bungalow', tip: 'Single-storey home' },
  { id: 'Duplex',   tip: 'Two-storey single-family home' },
  { id: 'Terrace',  tip: 'Row of attached units' },
];

const ATTACHMENTS: { id: VerityNG_HouseAttachment; label: string; tip: string }[] = [
  { id: 'Detached',     label: 'Detached',      tip: 'Standalone — no shared walls' },
  { id: 'SemiDetached', label: 'Semi-Detached', tip: 'Shares a wall with one neighbour' },
];

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
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 8,
          }}
        >
          {STYLES.map((s) => {
            const selected = style === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onStyleChange(s.id)}
                title={s.tip}
                style={{
                  background: '#fff',
                  border: selected ? '1px solid var(--gold)' : '1px solid var(--line)',
                  boxShadow: selected ? '0 0 0 1px var(--gold) inset' : undefined,
                  padding: '11px 14px',
                  borderRadius: 6,
                  textAlign: 'left',
                  cursor: 'pointer',
                  minHeight: 48,
                  fontSize: 14,
                  color: 'var(--navy)',
                  fontWeight: selected ? 500 : 400,
                }}
              >
                {s.id}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ATTACHMENTS.map((a) => (
            <CheckRow
              key={a.id}
              checked={attachment === a.id}
              onChange={() => onAttachmentChange(a.id)}
              label={a.label}
              title={a.tip}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  title,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  title?: string;
}) {
  return (
    <label
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        background: '#fff',
        border: checked ? '1px solid var(--gold)' : '1px solid var(--line)',
        borderRadius: 4,
        cursor: 'pointer',
        fontSize: 14,
        color: 'var(--navy)',
        width: 'fit-content',
        minWidth: 220,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ width: 16, height: 16, accentColor: 'var(--navy)' }}
      />
      {label}
    </label>
  );
}
