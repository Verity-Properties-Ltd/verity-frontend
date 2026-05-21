'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequestDraft } from '@/lib/hooks/useRequestDraft';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import type { DocumentMeta } from '@/lib/types/request';

const MAX_BYTES = 25 * 1024 * 1024;
const ACCEPT = '.pdf,.jpg,.jpeg,.png,.heic';

function extOf(name: string) {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toUpperCase() : 'FILE';
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentsStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useRequestDraft();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    const accepted: DocumentMeta[] = [];
    let rejected = 0;
    for (const f of incoming) {
      if (f.size > MAX_BYTES) { rejected++; continue; }
      accepted.push({ name: f.name, size: f.size, type: f.type || 'application/octet-stream', ext: extOf(f.name) });
    }
    if (accepted.length > 0) {
      update((d) => ({ ...d, documents: [...d.documents, ...accepted], noDocuments: false }));
    }
    setError(rejected > 0 ? `${rejected} file${rejected === 1 ? '' : 's'} exceeded 25 MB and were skipped.` : null);
  }

  function removeAt(i: number) {
    update((d) => ({ ...d, documents: d.documents.filter((_, idx) => idx !== i) }));
  }

  function toggleNoDocuments() {
    update((d) => ({ ...d, noDocuments: !d.noDocuments, documents: !d.noDocuments ? [] : d.documents }));
  }

  function onContinue() {
    if (draft.documents.length === 0 && !draft.noDocuments) return;
    router.push('/request/new/tier');
  }

  return (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Documents</div>
      <h2 className="bf-h2">
        Upload anything <em className="bf-italic">the seller has given you.</em>
      </h2>
      <p className="bf-small" style={{ marginTop: 10, maxWidth: 560 }}>
        Originals or photographs both fine. Encrypted on receipt; only verification specialists can open them.
      </p>

      <div
        className={`bf-upload${dragOver ? ' dragover' : ''}`}
        style={{ marginTop: 18, maxWidth: 720 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
        }}
      >
        <div className="iconw">
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M8 12V2M8 2L4 6M8 2l4 4M2 13v3h12v-3" stroke="#1E2260" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="bf-body" style={{ fontSize: 14, fontWeight: 500 }}>Drop files or tap to browse</div>
        <div className="bf-small" style={{ marginTop: 4, fontSize: 12 }}>PDF · JPG · PNG · HEIC · max 25 MB each</div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {error && <div className="bf-help error" style={{ marginTop: 10 }}>{error}</div>}

      {draft.documents.length > 0 && (
        <div className="bf-stack" style={{ gap: 10, marginTop: 18, maxWidth: 720 }}>
          {draft.documents.map((d, i) => (
            <div key={`${d.name}-${i}`} className="bf-doc">
              <div className="thumb">{d.ext.slice(0, 4)}</div>
              <div className="meta">
                <div className="name">{d.name}</div>
                <div className="sub">{fmtSize(d.size)}</div>
              </div>
              <button type="button" className="remove" onClick={() => removeAt(i)} aria-label={`Remove ${d.name}`}>
                REMOVE
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bf-row" style={{ gap: 10, marginTop: 22, alignItems: 'flex-start', maxWidth: 720 }}>
        <span
          className={`bf-check${draft.noDocuments ? ' on' : ''}`}
          onClick={toggleNoDocuments}
          role="checkbox"
          aria-checked={draft.noDocuments}
          tabIndex={0}
        />
        <div className="bf-small" style={{ lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--navy)' }}>I don&apos;t have any documents yet.</strong>
          <span style={{ display: 'block', marginTop: 2 }}>
            We can still verify the plot — confidence ceiling will be capped at{' '}
            <span className="bf-mono" style={{ fontSize: 11, color: 'var(--gold-deep)' }}>BRONZE</span>.
          </span>
        </div>
      </div>

      <WizardFooter
        back={{ href: '/request/new/property' }}
        primary={{
          label: <>Continue <span className="arrow">→</span></>,
          onClick: onContinue,
          disabled: !hydrated || (draft.documents.length === 0 && !draft.noDocuments),
        }}
      />
    </>
  );
}
