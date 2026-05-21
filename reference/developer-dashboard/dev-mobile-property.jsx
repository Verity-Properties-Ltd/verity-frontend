/* global React, DvmAppBar, DvmTabletRail, DvmBottomTabs, DvmPageBar, VP, Ico, DvmBandPill */
// VERITY · Property detail — mobile + tablet
// VRT-LA-2025-0184 · verification history + distribution log + metadata

function DvmPropertyDetail({ vp }) {
  if (VP.isPhone(vp)) {
    return (
      <div className={`dvm ${vp}`}>
        <DvmAppBar vp={vp} />
        <DvmPageBar
          eyebrow="VRT-LA-2025-0184"
          title="Lekki Block A · <em>Unit 14B</em>"
        />
        <PropertyBody vp={vp} />
        <DvmBottomTabs active="portfolio" />
      </div>
    );
  }
  return (
    <div className={`dvm ${vp}`}>
      <div className="dvm-railed">
        <DvmTabletRail vp={vp} active="portfolio" />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <DvmAppBar vp={vp} />
          <DvmPageBar
            eyebrow="VRT-LA-2025-0184"
            title="Lekki Block A · <em>Unit 14B</em>"
            right={(
              <>
                <button type="button" className="dvm-btn outline sm row" style={{ height: 36 }}>
                  {Ico.download} <span>Export PDF</span>
                </button>
                <button type="button" className="dvm-btn gold sm row" style={{ height: 36 }}>
                  {Ico.distribute} <span>Distribute</span>
                </button>
              </>
            )}
          />
          <PropertyBody vp={vp} />
        </div>
      </div>
    </div>
  );
}

function PropertyBody({ vp }) {
  return (
    <div className="dvm-body pad" style={{ paddingBottom: VP.isPhone(vp) ? 100 : 32 }}>
      {/* Hero */}
      <div className="dvm-prop-hero">
        <div className="ref">Verity property ID · VRT-LA-2025-0184</div>
        <h2>Lekki Phase 1 · Plot 12 · <em>Unit 14B,</em><br/>Three-bedroom maisonette.</h2>
        <span className="band">
          <span className="dot"></span>
          Gold · 84 confidence
        </span>
        <div className="kv">
          <div>
            <div className="k">Issued</div>
            <div className="v">11 May 2025</div>
          </div>
          <div>
            <div className="k">Expires</div>
            <div className="v">11 May 2026</div>
          </div>
          <div>
            <div className="k">Title type</div>
            <div className="v">C of O · LSLR</div>
          </div>
          <div>
            <div className="k">Issuances</div>
            <div className="v">42 · all-time</div>
          </div>
        </div>

        {VP.isPhone(vp) && (
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button type="button" className="dvm-btn outline sm" style={{ flex: 1 }}>{Ico.download}<span>PDF</span></button>
            <button type="button" className="dvm-btn gold sm" style={{ flex: 1 }}>{Ico.distribute}<span>Distribute</span></button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="dvm-tabs">
        <span className="tab active">Verification history</span>
        <span className="tab">Distribution log</span>
        <span className="tab">Documents</span>
        <span className="tab">Metadata</span>
      </div>

      {/* Verification history */}
      <div className="dvm-history">
        <div className="dvm-history-item">
          <span className="marker"></span>
          <div>
            <div className="when">14 May 2026 · 09:42 WAT</div>
            <div className="h">Confidence band held at <em>Gold · 84</em> on renewal review</div>
            <div className="sub">CAC company check and Lagos State Land Registry cross-check both passed automatically.</div>
            <span className="change">↻ No change since previous review</span>
          </div>
        </div>
        <div className="dvm-history-item">
          <span className="marker"></span>
          <div>
            <div className="when">21 Feb 2026 · 11:18 WAT</div>
            <div className="h">Court search uploaded · <em>High Court of Lagos</em></div>
            <div className="sub">Six-month search returned no encumbrances. Stamped by Solomon &amp; Associates, registered firm.</div>
            <span className="change">↑ Confidence ↑ 7 → Gold · 84</span>
          </div>
        </div>
        <div className="dvm-history-item">
          <span className="marker"></span>
          <div>
            <div className="when">12 Dec 2025 · 16:04 WAT</div>
            <div className="h">Survey plan validated by registered surveyor</div>
            <div className="sub">Sokoji Adekoya · SURCON licence SC-014522. Plan boundary matches LSLR record.</div>
            <span className="change">↑ Confidence ↑ 4 → Silver · 77</span>
          </div>
        </div>
        <div className="dvm-history-item">
          <span className="marker"></span>
          <div>
            <div className="when">11 May 2025 · 14:22 WAT</div>
            <div className="h">Certificate <em>issued</em> · Bronze · 73</div>
            <div className="sub">Initial issuance. Title document and Land Registry copy submitted. Survey and court search pending.</div>
          </div>
        </div>
        <div className="dvm-history-item">
          <span className="marker"></span>
          <div>
            <div className="when">04 May 2025 · 10:11 WAT</div>
            <div className="h">Property submitted by Adebola Ogundimu</div>
            <div className="sub">Lagos State Land Registry C of O · LSR/2018/L/2412</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DvmPropertyDetail });
