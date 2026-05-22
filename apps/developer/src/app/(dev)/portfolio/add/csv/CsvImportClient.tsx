'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { propertyService } from '@/lib/services';
import type { CsvParseResult } from '@/lib/types/property';

const SAMPLE = `address,type,state,ref
Lekki Block A · Plot 12,Land,Lagos,LKI-A-12
Ikoyi Foreshore · Unit 7B,Apartment,Lagos,IKY-FS-07B
Victoria Island Tower II · Fl 14,Apartment,Lagos,VI-T2-14
Banana Island · Villa 3,Villa,Lagos,BNI-V03
Surulere Block C · Plot 04,Land,Lagos,SUR-C-04
Magodo Phase II · Plot 18,Land,Lagos,MGD-2-18
Yaba Heights · Unit 22,Apartment,Lagos,YBH-22`;

export function CsvImportClient() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<CsvParseResult | null>(null);
  const [parsing, setParsing] = useState(false);

  async function onPick(file: File | null) {
    if (!file) return;
    setParsing(true);
    const r = await propertyService.parseCsv(file);
    setResult(r);
    setParsing(false);
  }

  async function onUseSample() {
    setParsing(true);
    const blob = new File([SAMPLE], 'portfolio_lekki_2026.csv', { type: 'text/csv' });
    const r = await propertyService.parseCsv(blob);
    setResult(r);
    setParsing(false);
  }

  function onReplace() {
    setResult(null);
    inputRef.current?.click();
  }

  if (!result) {
    return (
      <>
        <button
          type="button"
          className="dv-csv"
          onClick={() => inputRef.current?.click()}
          style={{ width: '100%', cursor: 'pointer' }}
        >
          <div className="icon-pad">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 3h7l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#1E2260" strokeWidth="1.4" fill="#fff" />
              <path d="M12 3v3h3M7 11h6M7 14h4" stroke="#1E2260" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="h">{parsing ? 'Parsing…' : 'Drop a CSV file or tap to browse'}</div>
          <div className="sub">Required columns: address · type · state · ref</div>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={(e) => onPick(e.target.files?.[0] || null)}
        />
        <div style={{ marginTop: 12, fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          No file?{' '}
          <button type="button" onClick={onUseSample} style={{ background: 'transparent', border: 0, padding: 0, color: 'var(--gold-deep)', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer', borderBottom: '1px solid var(--gold)' }}>
            try a 7-row sample
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="dv-csv">
        <div className="icon-pad">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 3h7l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#1E2260" strokeWidth="1.4" fill="#fff" />
            <path d="M12 3v3h3M7 11h6M7 14h4" stroke="#1E2260" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="h">{result.fileName} · {result.total} rows parsed</div>
        <div className="sub">
          {result.ok} valid · {result.warn} warning{result.warn === 1 ? '' : 's'} · {result.dup} duplicate{result.dup === 1 ? '' : 's'}
        </div>
      </div>

      <div className="dv-csv-table">
        <div className="dv-csv-row head">
          <span />
          <span>Property address</span>
          <span>Type</span>
          <span>State</span>
          <span>Internal ref</span>
          <span>Validation</span>
        </div>
        {result.rows.map((r) => (
          <div key={r.index} className="dv-csv-row">
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.12em' }}>
              {String(r.index).padStart(2, '0')}
            </span>
            <span style={{ color: 'var(--navy)', fontWeight: 500 }}>{r.address}</span>
            <span style={{ color: 'var(--slate)' }}>{r.type}</span>
            <span style={{ color: 'var(--slate)' }}>{r.state}</span>
            <span style={{ fontFamily: 'var(--f-meta)', fontSize: 11, color: 'var(--navy)', letterSpacing: '0.06em' }}>{r.ref}</span>
            <span>
              {r.validation.kind === 'ok' && (
                <span className="ok"><span className="dot" />VALID</span>
              )}
              {r.validation.kind === 'warn' && (
                <span className="ok warn" style={{ color: 'var(--gold-deep)' }}>⚠ {r.validation.message}</span>
              )}
              {r.validation.kind === 'dup' && (
                <span className="ok" style={{ color: '#B07A4A' }}>⚠ DUPLICATE</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <button type="button" className="dv-btn outline" onClick={onReplace}>
          Replace file
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/portfolio/add/type" className="dv-btn ghost" style={{ textDecoration: 'none' }}>
            Switch to single property
          </Link>
          <button type="button" className="dv-btn primary" disabled={result.dup + result.warn === result.total}>
            Continue to documents <span className="arrow">→</span>
          </button>
        </div>
      </div>
      <p style={{ marginTop: 14, fontSize: 11, color: 'var(--slate)', fontStyle: 'italic' }}>
        For Phase 3 the &ldquo;Continue to documents&rdquo; CTA is a stub — bulk-import ingestion lands with the Supabase swap.
      </p>
    </>
  );
}
