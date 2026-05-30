'use client';

import { useEffect, useState } from 'react';
import { PageHead } from '@dev/components/chrome/PageHead';
import { CopyButton } from '@dev/components/distribute/CopyButton';
import { QrPlaceholder } from '@dev/components/distribute/QrPlaceholder';
import { BadgeLockups } from '@dev/components/distribute/BadgeLockups';
import { distributionService } from '@dev/lib/services';

type Scope = 'all' | 'selected' | 'single';

export function DistributeClient({ initialVpid }: { initialVpid?: string }) {
  const [verifiedCount, setVerifiedCount] = useState(81);
  const [sampleVpid, setSampleVpid] = useState(initialVpid?.toUpperCase() || 'VRT-LA-2025-0184');
  const [sampleAddress, setSampleAddress] = useState('Lekki Block A · Plot 12');
  const [scope, setScope] = useState<Scope>(initialVpid ? 'single' : 'all');

  useEffect(() => {
    distributionService.getDefaultScope().then((s) => {
      setVerifiedCount(s.verifiedCount);
      if (!initialVpid) {
        setSampleVpid(s.sampleVpid);
        setSampleAddress(s.sampleAddress);
      }
    });
  }, [initialVpid]);

  const publicUrl = `https://verity.properties/v/${sampleVpid}`;
  const embedSnippet = distributionService.embedSnippet(sampleVpid);

  return (
    <>
      <PageHead
        eyebrow={`Revenue surface · ${verifiedCount} properties available`}
        title={<><em>Distribute</em> your verifications.</>}
        lede="Get certificate URLs, PDFs, embeds, and QR codes to deploy on your website, in sales conversations, and on physical signage. The richer your distribution, the more leverage you extract."
        actions={
          <>
            <button type="button" className="dv-btn outline">Bulk download · ZIP</button>
            <button type="button" className="dv-btn primary">
              Generate package <span className="arrow">→</span>
            </button>
          </>
        }
      />

      <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>For</span>
        <button type="button" onClick={() => setScope('all')} className={`dv-chip${scope === 'all' ? ' active' : ''}`}>
          All verified <span className="ct">{verifiedCount}</span>
        </button>
        <button type="button" onClick={() => setScope('selected')} className={`dv-chip${scope === 'selected' ? ' active' : ''}`}>
          Selected only <span className="ct">3</span>
        </button>
        <button type="button" onClick={() => setScope('single')} className={`dv-chip${scope === 'single' ? ' active' : ''}`}>
          Single property <span className="caret">▾</span>
        </button>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--f-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--slate)' }}>
          {sampleVpid} · {sampleAddress}
        </span>
      </div>

      <div className="dv-formats">
        {/* URL */}
        <div className="dv-format">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.24em' }}>FORMAT · 01</span>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate-soft)', letterSpacing: '0.16em' }}>PUBLIC LINK</span>
          </div>
          <div className="h">Verification URL</div>
          <div className="sub">A short, shareable URL anyone can resolve. Drop it into emails, SMS, social posts, or print.</div>
          <div className="preview">{publicUrl}</div>
          <div className="actions">
            <CopyButton onCopy={() => distributionService.copyUrl(sampleVpid)} label="Copy URL" />
            <button type="button" className="dv-btn outline sm">Bulk-copy {verifiedCount} URLs</button>
          </div>
        </div>

        {/* PDF */}
        <div className="dv-format">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.24em' }}>FORMAT · 02</span>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate-soft)', letterSpacing: '0.16em' }}>PRINT-READY</span>
          </div>
          <div className="h">PDF certificate</div>
          <div className="sub">Formatted Verification Report — print, attach to email, hand to a buyer at a sales meeting.</div>
          <div style={{ background: 'var(--cream)', border: '1px solid var(--line)', padding: '24px 18px', borderRadius: 3, marginBottom: 16, textAlign: 'center', position: 'relative' }}>
            <div
              style={{
                width: 92, height: 124,
                background: '#fff', border: '1px solid var(--line)',
                margin: '0 auto', position: 'relative',
                boxShadow: '4px 4px 0 var(--cream-deep)',
              }}
            >
              <div style={{ position: 'absolute', top: 8, left: 8, right: 8, height: 1, background: 'var(--gold)' }} />
              <div style={{ position: 'absolute', top: 14, left: 8, fontFamily: 'var(--f-mark)', fontSize: 8, letterSpacing: '0.2em', color: 'var(--navy)' }}>VERITY</div>
              <div style={{ position: 'absolute', top: 32, left: 8, right: 8, fontFamily: 'var(--f-display)', fontSize: 9, color: 'var(--navy)', textAlign: 'left', lineHeight: 1.2 }}>Verification Report</div>
              <div style={{ position: 'absolute', top: 54, left: 8, fontFamily: 'var(--f-meta)', fontSize: 6, color: 'var(--slate)', letterSpacing: '0.1em' }}>{sampleVpid}</div>
              <div style={{ position: 'absolute', bottom: 14, left: 8, right: 8, height: 6, background: 'var(--gold)', borderRadius: 1 }} />
              <div style={{ position: 'absolute', bottom: 6, left: 8, fontFamily: 'var(--f-meta)', fontSize: 6, color: 'var(--gold-deep)', letterSpacing: '0.18em' }}>GOLD</div>
            </div>
            <div style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate)', letterSpacing: '0.16em', marginTop: 14 }}>
              PDF · A4 · 2 PAGES · 184 KB
            </div>
          </div>
          <div className="actions">
            <button type="button" className="dv-btn primary sm">Download PDF</button>
            <button type="button" className="dv-btn outline sm">Bulk · ZIP ({verifiedCount})</button>
          </div>
        </div>

        {/* Embed */}
        <div className="dv-format">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.24em' }}>FORMAT · 03</span>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate-soft)', letterSpacing: '0.16em' }}>WEBSITE EMBED</span>
          </div>
          <div className="h">HTML embed snippet</div>
          <div className="sub">Renders the band pill plus a "View verification" link on your own listing page. Auto-updates if the band changes.</div>
          <div className="preview code">
            <span className="tag">&lt;script</span> <span className="attr">src</span>=<span className="str">&quot;https://cdn.verity.properties/embed.js&quot;</span> <span className="attr">data-vpid</span>=<span className="str">&quot;{sampleVpid}&quot;</span> <span className="tag">async&gt;&lt;/script&gt;</span>
          </div>
          <div className="actions">
            <CopyButton onCopy={() => distributionService.copyEmbed(sampleVpid)} label="Copy snippet" />
            <button type="button" className="dv-btn outline sm">Embed preview</button>
            <button type="button" className="dv-btn outline sm">Style options</button>
          </div>
        </div>

        {/* QR */}
        <div className="dv-format">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.24em' }}>FORMAT · 04</span>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate-soft)', letterSpacing: '0.16em' }}>OFFLINE / SIGNAGE</span>
          </div>
          <div className="h">QR code</div>
          <div className="sub">Printable QR resolving to the public verification URL. For sales offices, signboards, brochures, on-site posts.</div>
          <div className="qr"><QrPlaceholder /></div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', margin: '10px 0 14px' }}>
            {sampleVpid}
          </div>
          <div className="actions">
            <button type="button" className="dv-btn primary sm">Download · PNG</button>
            <button type="button" className="dv-btn outline sm">SVG</button>
            <button type="button" className="dv-btn outline sm">Print sheet</button>
          </div>
        </div>

        {/* Founding Partner badge — spans full width */}
        <div className="dv-format" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--gold-deep)', letterSpacing: '0.24em' }}>FORMAT · 05</span>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 9, color: 'var(--slate-soft)', letterSpacing: '0.16em' }}>BRAND ASSET</span>
          </div>
          <div className="h">Founding Partner badge</div>
          <div className="sub">For your homepage. Signals VERITY membership. Available in light, dark, and horizontal lockups.</div>
          <BadgeLockups />
          <div className="actions" style={{ marginTop: 18 }}>
            <button type="button" className="dv-btn primary sm">Download · PNG (all)</button>
            <button type="button" className="dv-btn outline sm">SVG</button>
            <button type="button" className="dv-btn outline sm">Brand guidelines</button>
          </div>
        </div>
      </div>
    </>
  );
}
