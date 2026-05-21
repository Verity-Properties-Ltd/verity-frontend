/* global React, DvmAppBar, DvmTabletRail, DvmBottomTabs, DvmPageBar, VP, Ico */
// VERITY · Distribute — mobile + tablet
// Five formats — URL · PDF · Embed · QR · Partner badge

function DvmDistribute({ vp }) {
  if (VP.isPhone(vp)) {
    return (
      <div className={`dvm ${vp}`}>
        <DvmAppBar vp={vp} />
        <DvmPageBar
          eyebrow="04.8 · Distribute · VRT-LA-2025-0184"
          title="Share <em>certificate.</em>"
        />
        <DistributeBody vp={vp} />
        <DvmBottomTabs active="distribute" />
      </div>
    );
  }
  return (
    <div className={`dvm ${vp}`}>
      <div className="dvm-railed">
        <DvmTabletRail vp={vp} active="distribute" />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <DvmAppBar vp={vp} />
          <DvmPageBar
            eyebrow="04.8 · Distribute · VRT-LA-2025-0184"
            title="Share <em>certificate.</em>"
          />
          <DistributeBody vp={vp} />
        </div>
      </div>
    </div>
  );
}

function DistributeBody({ vp }) {
  return (
    <div className="dvm-body pad" style={{ paddingBottom: VP.isPhone(vp) ? 100 : 32 }}>
      {/* Subject hero */}
      <div style={{
        border: '1px solid var(--line)',
        background: 'linear-gradient(180deg, var(--cream) 0%, var(--cream-shade) 100%)',
        padding: '16px 18px', marginBottom: 18, position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold)' }}></div>
        <div style={{
          fontFamily: 'var(--f-meta)', fontSize: 10,
          color: 'var(--slate)', letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}>Sharing · Lekki Block A · Unit 14B</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginTop: 6, gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{
            fontFamily: 'var(--f-meta)', fontSize: 12,
            color: 'var(--navy)', letterSpacing: '0.06em',
          }}>VRT-LA-2025-0184 · Gold · 84</div>
          <div style={{
            fontFamily: 'var(--f-meta)', fontSize: 10,
            color: 'var(--slate)', letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>42 issuances · 30 days · 11</div>
        </div>
      </div>

      <div className="dvm-formats">
        {/* URL */}
        <div className="dvm-format">
          <span className="ico">{Ico.link}</span>
          <div className="h">Direct URL</div>
          <div className="sub">A clean Verity URL — best for SMS, WhatsApp, email signature.</div>
          <div className="preview">verity.properties/v/VRT-LA-2025-0184</div>
          <div className="acts">
            <button type="button" className="dvm-btn sm" style={{ width: 'auto' }}>{Ico.copy}<span>Copy link</span></button>
            <button type="button" className="dvm-btn sm outline" style={{ width: 'auto' }}>Open</button>
          </div>
        </div>

        {/* PDF */}
        <div className="dvm-format">
          <span className="ico">{Ico.pdf}</span>
          <div className="h">PDF certificate</div>
          <div className="sub">Letter-format certificate with signature seals and verification QR.</div>
          <div className="preview" style={{ paddingTop: 24, paddingBottom: 24, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 14, color: 'var(--navy)' }}>verity-certificate.pdf</div>
            <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', marginTop: 4, letterSpacing: '0.12em', textTransform: 'uppercase' }}>1 page · 318 KB</div>
          </div>
          <div className="acts">
            <button type="button" className="dvm-btn sm" style={{ width: 'auto' }}>{Ico.download}<span>Download</span></button>
            <button type="button" className="dvm-btn sm outline" style={{ width: 'auto' }}>Email…</button>
          </div>
        </div>

        {/* Embed */}
        <div className="dvm-format">
          <span className="ico">{Ico.code}</span>
          <div className="h">Embed widget</div>
          <div className="sub">Drop into your listing page — a one-line script renders a confidence badge.</div>
          <div className="preview code">
            <div>&lt;<span className="tag">script</span> <span className="attr">src</span>=<span className="str">"https://verity.properties/embed.js"</span>&gt;&lt;/<span className="tag">script</span>&gt;</div>
            <div>&lt;<span className="tag">div</span> <span className="attr">data-vpid</span>=<span className="str">"VRT-LA-2025-0184"</span>&gt;&lt;/<span className="tag">div</span>&gt;</div>
          </div>
          <div className="acts">
            <button type="button" className="dvm-btn sm" style={{ width: 'auto' }}>{Ico.copy}<span>Copy snippet</span></button>
            <button type="button" className="dvm-btn sm outline" style={{ width: 'auto' }}>Preview</button>
          </div>
        </div>

        {/* QR */}
        <div className="dvm-format">
          <span className="ico">{Ico.qr}</span>
          <div className="h">QR code</div>
          <div className="sub">High-contrast QR for printed brochures and yard signage.</div>
          <div className="qr">
            <QrPattern />
          </div>
          <div className="acts">
            <button type="button" className="dvm-btn sm" style={{ width: 'auto' }}>{Ico.download}<span>PNG</span></button>
            <button type="button" className="dvm-btn sm outline" style={{ width: 'auto' }}>SVG</button>
          </div>
        </div>

        {/* Partner badge */}
        <div className="dvm-format">
          <span className="ico">{Ico.badge}</span>
          <div className="h">Partner badge</div>
          <div className="sub">Founding 50 mark — display on your site footer and listing pages.</div>
          <div className="badge-preview">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--navy-deep)', color: 'var(--cream)',
              padding: '8px 14px', borderTop: '2px solid var(--gold)',
              borderRadius: 4,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 999,
                background: 'var(--gold)', color: 'var(--navy)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--f-display)', fontStyle: 'italic', fontSize: 13, fontWeight: 500,
              }}>V</span>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{
                  fontFamily: 'var(--f-mark)', fontSize: 10,
                  letterSpacing: '0.22em', color: 'var(--cream)',
                }}>VERITY</div>
                <div style={{
                  fontFamily: 'var(--f-meta)', fontSize: 8,
                  letterSpacing: '0.18em', color: 'var(--gold)',
                  textTransform: 'uppercase', marginTop: 2,
                }}>Founding 50 · 014</div>
              </div>
            </div>
          </div>
          <div className="acts">
            <button type="button" className="dvm-btn sm" style={{ width: 'auto' }}>{Ico.copy}<span>Copy code</span></button>
            <button type="button" className="dvm-btn sm outline" style={{ width: 'auto' }}>Variants</button>
          </div>
        </div>

        {/* Native share — phone exclusive nicety */}
        {VP.isPhone(vp) && (
          <div className="dvm-format" style={{
            background: 'var(--navy)', color: 'var(--cream)',
            border: '1px solid var(--navy)',
          }}>
            <span className="ico" style={{ background: 'rgba(245,242,237,0.08)', borderColor: 'rgba(245,242,237,0.2)', color: 'var(--cream)' }}>{Ico.distribute}</span>
            <div className="h" style={{ color: 'var(--cream)' }}>Native share sheet</div>
            <div className="sub" style={{ color: 'rgba(245,242,237,0.7)' }}>Open the system share sheet — WhatsApp, Messages, AirDrop, Mail.</div>
            <div className="acts">
              <button type="button" className="dvm-btn gold sm" style={{ width: 'auto' }}>
                {Ico.distribute} <span>Open share</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Synthetic QR pattern — purely decorative placeholder
function QrPattern() {
  const cells = [];
  // deterministic pseudo-random pattern
  const seed = (x, y) => {
    const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (s - Math.floor(s)) > 0.5;
  };
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      // finder squares
      const inFinder = (x, y) =>
        (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      let fill = false;
      if (inFinder(x, y)) {
        const fx = x < 7 ? x : x - 14;
        const fy = y < 7 ? y : y - 14;
        fill = !(fx > 0 && fx < 6 && fy > 0 && fy < 6 && !(fx > 1 && fx < 5 && fy > 1 && fy < 5));
      } else {
        fill = seed(x, y);
      }
      if (fill) cells.push(<rect key={`${x}-${y}`} x={x * 4 + 2} y={y * 4 + 2} width="4" height="4" fill="var(--navy)" />);
    }
  }
  return (
    <svg viewBox="0 0 88 88" width="88" height="88">
      {cells}
    </svg>
  );
}

Object.assign(window, { DvmDistribute });
