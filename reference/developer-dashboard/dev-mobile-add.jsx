/* global React, DvmAppBar, DvmTabletRail, DvmBottomTabs, DvmPageBar, VP, Ico */
// VERITY · Add property — mobile + tablet
// Two variants: single (wizard step 02/05 · title documents) + CSV bulk

function DvmAddProperty({ vp }) {
  return (
    <Wrapper vp={vp} active="add" eyebrow="04.6 · New property · step 02 of 05" title="Add a <em>property.</em>">
      {/* Mode tabs */}
      <div className="dvm-wiz-mode">
        <div className="tab on">Single</div>
        <div className="tab">Batch <span className="ct">2–10</span></div>
        <div className="tab">CSV <span className="ct">11+</span></div>
      </div>

      {/* Stepper */}
      <div className="dvm-stepper">
        <div className="seg done"></div>
        <div className="seg current"></div>
        <div className="seg"></div>
        <div className="seg"></div>
        <div className="seg"></div>
        <span className="ct">2 / 5</span>
      </div>

      <div style={{
        fontFamily: 'var(--f-meta)', fontSize: 10,
        color: 'var(--gold-deep)', letterSpacing: '0.22em',
        textTransform: 'uppercase', marginTop: 6,
      }}>Step 02 · Title documents</div>
      <h2 style={{
        fontFamily: 'var(--f-display)', fontSize: VP.isPhone(vp) ? 22 : 26,
        fontWeight: 500, color: 'var(--navy)', margin: '6px 0 6px',
        letterSpacing: '-0.005em', lineHeight: 1.2,
      }}>
        Upload your <em style={{ fontStyle: 'italic', color: 'var(--gold-deep)', fontWeight: 400 }}>title documents</em>.
      </h2>
      <p style={{
        fontFamily: 'var(--f-display)', fontStyle: 'italic',
        fontSize: 14.5, color: 'var(--slate)', margin: '0 0 18px', lineHeight: 1.5,
      }}>
        Lagos State Land Registry copy at minimum. Survey plan and court search push you toward Platinum.
      </p>

      {/* Title sheet — already uploaded */}
      <UploadSlot
        label="Title document"
        sub="Lagos State Land Registry · Original or certified copy."
        state="uploaded"
        filename="LH-Block-A-14B-CofO.pdf"
        size="2.4 MB · 6 pages"
      />
      <UploadSlot
        label="Survey plan"
        sub="Stamped by a registered surveyor. Strongly recommended."
        state="uploading"
        filename="LH-Block-A-14B-Survey.pdf"
        progress={68}
      />
      <UploadSlot
        label="Court search"
        sub="High Court of Lagos State · within 90 days. Optional but unlocks Platinum."
        state="empty"
      />
      <UploadSlot
        label="Family land consent · if applicable"
        sub="Required only if title sits on family land."
        state="empty"
        optional
      />

      {/* Confidence preview */}
      <div style={{
        marginTop: 18,
        background: 'var(--cream)', border: '1px solid var(--line)',
        padding: VP.isPhone(vp) ? '14px 16px' : '18px 20px',
      }}>
        <div style={{
          fontFamily: 'var(--f-meta)', fontSize: 9,
          letterSpacing: '0.22em', color: 'var(--slate)',
          textTransform: 'uppercase', marginBottom: 8,
        }}>Projected confidence band</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(201,169,97,0.18)', color: 'var(--gold-deep)',
            fontFamily: 'var(--f-meta)', fontSize: 11,
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--gold)' }}></span>
            Gold · 84
          </span>
          <span style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 14, color: 'var(--slate)' }}>
            → upload a court search to reach <em style={{ color: '#4a5478' }}>Platinum.</em>
          </span>
        </div>
      </div>

      <div style={{ marginTop: VP.isPhone(vp) ? 80 : 24 }}></div>

      <div className="dvm-bottom-action">
        <button type="button" className="dvm-btn outline" style={{ flex: 0, minWidth: VP.isPhone(vp) ? 100 : 140 }}>
          ← Back
        </button>
        <button type="button" className="dvm-btn" style={{ flex: 1 }}>
          <span>Continue to verification</span> <span className="arrow">→</span>
        </button>
      </div>
    </Wrapper>
  );
}

function UploadSlot({ label, sub, state, filename, size, progress, optional }) {
  const isUploaded = state === 'uploaded';
  const isUploading = state === 'uploading';
  const bg = isUploaded ? 'rgba(79,143,79,0.05)'
    : isUploading ? 'rgba(201,169,97,0.06)'
    : '#fff';
  const border = isUploaded ? 'rgba(79,143,79,0.32)'
    : isUploading ? 'var(--gold-soft)'
    : 'var(--line-strong)';
  return (
    <div style={{
      border: `1px ${state === 'empty' ? 'dashed' : 'solid'} ${border}`,
      background: bg,
      borderRadius: 6,
      padding: '14px 16px',
      marginBottom: 10,
      display: 'grid',
      gridTemplateColumns: '38px 1fr auto',
      gap: 12,
      alignItems: 'center',
    }}>
      <span style={{
        width: 38, height: 38, borderRadius: 999,
        background: '#fff', border: `1px solid ${border}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: isUploaded ? 'var(--success)' : isUploading ? 'var(--gold-deep)' : 'var(--slate)',
      }}>
        {isUploaded ? Ico.check : isUploading ? Ico.upload : Ico.doc}
      </span>
      <div>
        <div style={{
          fontSize: 14, color: 'var(--navy)', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          {label}
          {optional && <span style={{
            fontFamily: 'var(--f-meta)', fontSize: 9,
            letterSpacing: '0.18em', color: 'var(--slate-soft)',
            textTransform: 'uppercase',
          }}>· optional</span>}
        </div>
        {isUploaded && (
          <div style={{
            marginTop: 4, fontFamily: 'var(--f-meta)', fontSize: 10.5,
            color: 'var(--slate)', letterSpacing: '0.08em',
          }}>{filename} · {size}</div>
        )}
        {isUploading && (
          <>
            <div style={{
              marginTop: 4, fontFamily: 'var(--f-meta)', fontSize: 10.5,
              color: 'var(--slate)', letterSpacing: '0.08em',
            }}>{filename} · uploading… {progress}%</div>
            <div style={{
              marginTop: 6, height: 3, background: 'var(--line)',
              borderRadius: 999, overflow: 'hidden',
            }}>
              <div style={{
                width: `${progress}%`, height: '100%', background: 'var(--gold)',
              }}></div>
            </div>
          </>
        )}
        {state === 'empty' && (
          <div style={{
            marginTop: 4, fontSize: 12.5, color: 'var(--slate)', lineHeight: 1.5,
          }}>{sub}</div>
        )}
      </div>
      <div>
        {isUploaded && (
          <span style={{
            fontFamily: 'var(--f-meta)', fontSize: 10,
            letterSpacing: '0.18em', color: 'var(--slate)',
            textTransform: 'uppercase',
            borderBottom: '1px solid var(--line-strong)',
            paddingBottom: 1,
          }}>Replace</span>
        )}
        {isUploading && (
          <span style={{
            fontFamily: 'var(--f-meta)', fontSize: 10,
            letterSpacing: '0.18em', color: 'var(--danger)',
            textTransform: 'uppercase',
          }}>Cancel</span>
        )}
        {state === 'empty' && (
          <button type="button" className="dvm-btn sm outline" style={{ width: 'auto', padding: '0 14px' }}>
            Upload
          </button>
        )}
      </div>
    </div>
  );
}

// ── CSV bulk ───────────────────────────────────────────────────
function DvmBulkCsv({ vp }) {
  return (
    <Wrapper vp={vp} active="add" eyebrow="04.6 · Bulk import · CSV" title="CSV <em>import.</em>">
      <div className="dvm-wiz-mode">
        <div className="tab">Single</div>
        <div className="tab">Batch <span className="ct">2–10</span></div>
        <div className="tab on">CSV <span className="ct">11+</span></div>
      </div>

      <div className="dvm-csv">
        <div className="ic-pad">{Ico.upload}</div>
        <div className="h">verity_template.csv parsed</div>
        <div className="sub">18 rows · 17 validated · 1 needs review</div>
        <div style={{
          marginTop: 14, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <button type="button" className="dvm-btn sm outline" style={{ width: 'auto' }}>Replace file</button>
          <button type="button" className="dvm-btn sm outline" style={{ width: 'auto' }}>
            {Ico.download} <span>Re-download template</span>
          </button>
        </div>
      </div>

      <div className="dvm-csv-summary">
        <div className="cell">
          <div className="v">18</div>
          <div className="l">Rows parsed</div>
        </div>
        <div className="cell">
          <div className="v ok">17</div>
          <div className="l">Validated</div>
        </div>
        <div className="cell">
          <div className="v warn">1</div>
          <div className="l">Needs review</div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        margin: '20px 0 8px', paddingBottom: 8,
        borderBottom: '1px solid var(--line)',
      }}>
        <h3 style={{
          fontFamily: 'var(--f-mark)', fontSize: 12,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--navy)', fontWeight: 400, margin: 0,
        }}>Preview · first 6 of 18</h3>
        <span style={{
          fontFamily: 'var(--f-meta)', fontSize: 10,
          color: 'var(--slate)', letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>Show all</span>
      </div>

      <div className="dvm-csv-rows">
        <CsvRow address="Lekki Phase 1 · Plot 14B" code="LH-A14B-26" status="ok" projected="Gold" />
        <CsvRow address="Lekki Phase 1 · Plot 14C" code="LH-A14C-26" status="ok" projected="Gold" />
        <CsvRow address="Lekki Phase 1 · Plot 19A" code="LH-A19A-26" status="ok" projected="Silver" />
        <CsvRow address="Lekki Phase 1 · Plot 19B" code="LH-A19B-26" status="ok" projected="Silver" />
        <CsvRow address="Lekki Phase 1 · Plot 22A" code="LH-A22A-26" status="warn" projected="Provisional" warnMsg="Missing court search reference" />
        <CsvRow address="Lekki Phase 1 · Plot 22B" code="LH-A22B-26" status="ok" projected="Gold" />
      </div>

      <div style={{
        marginTop: 14,
        fontFamily: 'var(--f-meta)', fontSize: 10,
        color: 'var(--slate)', letterSpacing: '0.14em',
        textTransform: 'uppercase',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--gold)' }}></span>
        Founding 50 · all 18 issuances complimentary
      </div>

      <div style={{ marginTop: VP.isPhone(vp) ? 80 : 24 }}></div>

      <div className="dvm-bottom-action">
        <button type="button" className="dvm-btn outline" style={{ flex: 0, minWidth: VP.isPhone(vp) ? 110 : 160 }}>
          Save as draft
        </button>
        <button type="button" className="dvm-btn" style={{ flex: 1 }}>
          <span>Submit 17 for verification</span> <span className="arrow">→</span>
        </button>
      </div>
    </Wrapper>
  );
}

function CsvRow({ address, code, status, projected, warnMsg }) {
  return (
    <div className="dvm-csv-row">
      <div>
        <div className="addr">{address}</div>
        <div className="meta">
          {code} · projected <em style={{ fontStyle: 'normal', color: 'var(--gold-deep)' }}>{projected}</em>
          {warnMsg && <> · {warnMsg}</>}
        </div>
      </div>
      <div className={`status ${status === 'warn' ? 'warn' : ''}`}>
        <span className="dot"></span>{status === 'warn' ? 'Review' : 'Ready'}
      </div>
    </div>
  );
}

// ── shared shell wrapper (no DvmShell — we want bottom action bar control) ──
function Wrapper({ vp, eyebrow, title, active, children }) {
  if (VP.isPhone(vp)) {
    return (
      <div className={`dvm ${vp}`}>
        <DvmAppBar vp={vp} />
        <DvmPageBar eyebrow={eyebrow} title={title} />
        <div className="dvm-body pad" style={{ paddingBottom: 120 }}>{children}</div>
        <DvmBottomTabs active={active} />
      </div>
    );
  }
  return (
    <div className={`dvm ${vp}`}>
      <div className="dvm-railed">
        <DvmTabletRail vp={vp} active={active} />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <DvmAppBar vp={vp} />
          <DvmPageBar eyebrow={eyebrow} title={title} />
          <div className="dvm-body pad" style={{ paddingBottom: 32 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DvmAddProperty, DvmBulkCsv });
