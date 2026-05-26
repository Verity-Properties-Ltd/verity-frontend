'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { WizardCard } from '@/components/wizard/WizardCard';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { commitDraft, useAddPropertyDraft } from '@/lib/hooks/useAddPropertyDraft';
import { DOCUMENT_LABELS, type DocumentSlot } from '@/lib/types/add';

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DocumentsStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useAddPropertyDraft();
  const inputRefs = useRef<Record<DocumentSlot, HTMLInputElement | null>>({} as Record<DocumentSlot, HTMLInputElement | null>);

  function onPickFile(slot: DocumentSlot, file: File | null) {
    if (!file) return;
    update((d) => ({
      ...d,
      documents: { ...d.documents, [slot]: { name: file.name, size: file.size, type: file.type || 'application/octet-stream' } },
    }));
  }

  const requiredSlots: DocumentSlot[] = ['cofo', 'survey', 'deed'];
  const hasAllRequired = requiredSlots.every((s) => draft.documents[s]);

  return (
    <WizardCard
      slug="documents"
      title={<>Upload <em>title evidence</em> for this property.</>}
      lede="Provide as much as you have. The more documents we receive, the higher the confidence band you'll achieve."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 24 }} className="dv-add-docs">
        {(Object.keys(DOCUMENT_LABELS) as DocumentSlot[]).map((slot) => {
          const cfg = DOCUMENT_LABELS[slot];
          const uploaded = draft.documents[slot];
          return (
            <button
              key={slot}
              type="button"
              onClick={() => inputRefs.current[slot]?.click()}
              style={{
                background: '#fff',
                border: uploaded ? '1px solid var(--gold-soft)' : '1px dashed var(--line-strong)',
                padding: 16,
                borderRadius: 4,
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: 40, height: 48,
                  background: uploaded ? 'var(--cream-shade)' : 'var(--cream)',
                  border: '1px solid var(--line)', borderRadius: 2,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate)', letterSpacing: '0.1em',
                  flexShrink: 0,
                }}
              >
                {uploaded ? uploaded.name.split('.').pop()?.toUpperCase().slice(0, 4) : 'DOC'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 500 }}>
                  {cfg.label}
                  {!cfg.required && <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate-soft)', letterSpacing: '0.16em', marginLeft: 8, textTransform: 'uppercase' }}>· optional</span>}
                </div>
                <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.08em', marginTop: 2 }}>
                  {uploaded ? `${uploaded.name} · ${fmtSize(uploaded.size)}` : cfg.note}
                </div>
              </div>
              {uploaded && (
                <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: '#4F8F4F', letterSpacing: '0.18em', flexShrink: 0 }}>✓ DONE</span>
              )}
              <input
                ref={(el) => { inputRefs.current[slot] = el; }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.heic"
                style={{ display: 'none' }}
                onChange={(e) => onPickFile(slot, e.target.files?.[0] || null)}
              />
            </button>
          );
        })}
      </div>

      <WizardFooter
        back={{ href: '/portfolio/add/type', label: 'Back to address' }}
        primary={{
          label: <>Continue · review <span className="arrow">→</span></>,
          onClick: () => router.push('/portfolio/add/review'),
          disabled: !hydrated || !hasAllRequired,
        }}
        saveDraft={{
          disabled: !hydrated || !draft.category,
          onClick: () => {
            const resumeVpid =
              typeof window !== 'undefined'
                ? window.sessionStorage.getItem('verity:dev-add-resume-vpid') || undefined
                : undefined;
            const { vpid } = commitDraft(draft, resumeVpid);
            router.push(`/portfolio?just-saved=${vpid}`);
          },
        }}
      />
    </WizardCard>
  );
}
