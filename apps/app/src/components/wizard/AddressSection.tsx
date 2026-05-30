'use client';

import { useMemo } from 'react';
import { NG_STATES, lgasFor } from '@verity/reso';

export type AddressFormValue = {
  streetAddressInput: string;
  Verity_NG_PlotNumber?: string;
  Verity_NG_Neighborhood?: string;
  UnitNumber?: string;
  City: string;
  CountyOrParish: string;
  StateOrProvince: string;
  PostalCode?: string;
};

export type AddressFormPatch = Partial<AddressFormValue>;

/**
 * Per Area & Measurement v1 §4 + Address Capture §4.6:
 * - `hidden`   → Landed Property has no unit.
 * - `required` → Apartment / Flat must identify the unit to be addressable.
 * - `optional` → House (default) — a unit number may or may not exist.
 */
export type FlatNumberMode = 'hidden' | 'optional' | 'required';

const POSTAL_REGEX = /^\d{0,6}$/;

export function AddressSection({
  value,
  onChange,
  flatNumberMode = 'optional',
}: {
  value: AddressFormValue;
  onChange: (patch: AddressFormPatch) => void;
  flatNumberMode?: FlatNumberMode;
}) {
  const lgaOptions = useMemo(() => lgasFor(value.StateOrProvince), [value.StateOrProvince]);
  const hasLgaDropdown = lgaOptions.length > 0;
  const postal = value.PostalCode ?? '';
  const postalInvalid = postal.length > 0 && !/^\d{6}$/.test(postal);

  function onStateChange(next: string) {
    const nextLgas = lgasFor(next);
    const lgaStillValid = nextLgas.length === 0 || nextLgas.includes(value.CountyOrParish);
    onChange({ StateOrProvince: next, CountyOrParish: lgaStillValid ? value.CountyOrParish : '' });
  }

  function onPostalChange(next: string) {
    if (POSTAL_REGEX.test(next)) onChange({ PostalCode: next || undefined });
  }

  return (
    <div className="bf-stack" style={{ gap: 14 }}>
      <div className="bf-field">
        <label className="bf-label" htmlFor="streetAddress">Street address *</label>
        <input
          id="streetAddress"
          className="bf-input"
          placeholder="12B Admiralty Way"
          value={value.streetAddressInput}
          onChange={(e) => onChange({ streetAddressInput: e.target.value })}
        />
      </div>

      <div className="bf-grid-2">
        <div className="bf-field">
          <label className="bf-label" htmlFor="plotNo">
            Plot / Block number <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span>
          </label>
          <input
            id="plotNo"
            className="bf-input"
            placeholder="Plot 14, Block 23"
            title="Found on your Certificate of Occupancy"
            value={value.Verity_NG_PlotNumber ?? ''}
            onChange={(e) => onChange({ Verity_NG_PlotNumber: e.target.value || undefined })}
          />
        </div>
        {flatNumberMode !== 'hidden' && (
          <div className="bf-field">
            <label className="bf-label" htmlFor="unitNo">
              Flat / Unit number{' '}
              {flatNumberMode === 'required'
                ? <span style={{ color: 'var(--gold-deep)' }}>*</span>
                : <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span>}
            </label>
            <input
              id="unitNo"
              className="bf-input"
              placeholder="Flat 3"
              value={value.UnitNumber ?? ''}
              onChange={(e) => onChange({ UnitNumber: e.target.value || undefined })}
            />
            {flatNumberMode === 'required' && !(value.UnitNumber ?? '').trim() && (
              <span style={{ fontSize: 11, color: 'var(--gold-deep)', marginTop: 4 }}>
                Apartments need a flat or unit identifier.
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bf-field">
        <label className="bf-label" htmlFor="neighborhood">
          Neighbourhood or estate name <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span>
        </label>
        <input
          id="neighborhood"
          className="bf-input"
          placeholder="Lekki Phase 1"
          title='e.g. "Lekki Phase 1", "Banana Island Estate", "Magodo GRA Phase 2"'
          value={value.Verity_NG_Neighborhood ?? ''}
          onChange={(e) => onChange({ Verity_NG_Neighborhood: e.target.value || undefined })}
        />
      </div>

      <div className="bf-grid-2">
        <div className="bf-field">
          <label className="bf-label" htmlFor="city">City *</label>
          <input
            id="city"
            className="bf-input"
            placeholder="Lekki"
            value={value.City}
            onChange={(e) => onChange({ City: e.target.value })}
          />
        </div>
        <div className="bf-field">
          <label className="bf-label" htmlFor="lga">Local Government Area *</label>
          {hasLgaDropdown ? (
            <select
              id="lga"
              className="bf-input"
              value={value.CountyOrParish}
              onChange={(e) => onChange({ CountyOrParish: e.target.value })}
            >
              <option value="">Select an LGA…</option>
              {lgaOptions.map((lga) => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
          ) : (
            <input
              id="lga"
              className="bf-input"
              placeholder="Enter LGA"
              value={value.CountyOrParish}
              onChange={(e) => onChange({ CountyOrParish: e.target.value })}
            />
          )}
        </div>
      </div>

      <div className="bf-grid-2">
        <div className="bf-field">
          <label className="bf-label" htmlFor="state">State *</label>
          <select
            id="state"
            className="bf-input"
            value={value.StateOrProvince}
            onChange={(e) => onStateChange(e.target.value)}
          >
            {NG_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="bf-field">
          <label className="bf-label" htmlFor="postcode">
            Postal code <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span>
          </label>
          <input
            id="postcode"
            className="bf-input mono"
            placeholder="106104"
            inputMode="numeric"
            maxLength={6}
            value={postal}
            onChange={(e) => onPostalChange(e.target.value)}
          />
          {postalInvalid && (
            <span style={{ fontSize: 11, color: 'var(--gold-deep)', marginTop: 4 }}>
              Postal code must be 6 digits.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
