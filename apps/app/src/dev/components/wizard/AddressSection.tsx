'use client';

import { useMemo } from 'react';
import { NG_STATES, lgasFor } from '@verity/reso';

export type AddressFormValue = {
  streetAddressInput: string;
  Verity_NG_PlotNumber: string;
  Verity_NG_Neighborhood: string;
  UnitNumber: string;
  City: string;
  CountyOrParish: string;
  StateOrProvince: string;
  PostalCode: string;
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
  const postalInvalid = value.PostalCode.length > 0 && !/^\d{6}$/.test(value.PostalCode);

  function onStateChange(next: string) {
    // Reset LGA if it's no longer in the new state's list (avoid stale Lagos LGAs after switching to Kano).
    const nextLgas = lgasFor(next);
    const lgaStillValid = nextLgas.length === 0 || nextLgas.includes(value.CountyOrParish);
    onChange({ StateOrProvince: next, CountyOrParish: lgaStillValid ? value.CountyOrParish : '' });
  }

  function onPostalChange(next: string) {
    // Allow up to 6 digits; reject anything else as the user types.
    if (POSTAL_REGEX.test(next)) onChange({ PostalCode: next });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="dv-field full">
        <label className="lbl" htmlFor="streetAddress">Street address</label>
        <input
          id="streetAddress"
          className="dv-input"
          placeholder="12B Admiralty Way"
          value={value.streetAddressInput}
          onChange={(e) => onChange({ streetAddressInput: e.target.value })}
        />
      </div>

      <div className="row">
        <div className="dv-field">
          <label className="lbl" htmlFor="plotNo">
            Plot / Block number <span className="opt">(optional)</span>
          </label>
          <input
            id="plotNo"
            className="dv-input"
            placeholder="Plot 14, Block 23"
            title="Found on your Certificate of Occupancy"
            value={value.Verity_NG_PlotNumber}
            onChange={(e) => onChange({ Verity_NG_PlotNumber: e.target.value })}
          />
        </div>
        {flatNumberMode !== 'hidden' && (
          <div className="dv-field">
            <label className="lbl" htmlFor="unitNo">
              Flat / Unit number{' '}
              {flatNumberMode === 'required'
                ? <span className="req" aria-hidden="true">*</span>
                : <span className="opt">(optional)</span>}
            </label>
            <input
              id="unitNo"
              className="dv-input"
              placeholder="Flat 3"
              value={value.UnitNumber}
              onChange={(e) => onChange({ UnitNumber: e.target.value })}
            />
            {flatNumberMode === 'required' && !value.UnitNumber.trim() && (
              <span className="help">Apartments need a flat or unit identifier.</span>
            )}
          </div>
        )}
      </div>

      <div className="dv-field full">
        <label className="lbl" htmlFor="neighborhood">
          Neighbourhood or estate name <span className="opt">(optional)</span>
        </label>
        <input
          id="neighborhood"
          className="dv-input"
          placeholder="Lekki Phase 1"
          title='e.g. "Lekki Phase 1", "Banana Island Estate", "Magodo GRA Phase 2"'
          value={value.Verity_NG_Neighborhood}
          onChange={(e) => onChange({ Verity_NG_Neighborhood: e.target.value })}
        />
      </div>

      <div className="row">
        <div className="dv-field">
          <label className="lbl" htmlFor="city">City</label>
          <input
            id="city"
            className="dv-input"
            placeholder="Lekki"
            value={value.City}
            onChange={(e) => onChange({ City: e.target.value })}
          />
        </div>
        <div className="dv-field">
          <label className="lbl" htmlFor="lga">Local Government Area</label>
          {hasLgaDropdown ? (
            <select
              id="lga"
              className="dv-input"
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
              className="dv-input"
              placeholder="Enter LGA"
              value={value.CountyOrParish}
              onChange={(e) => onChange({ CountyOrParish: e.target.value })}
            />
          )}
        </div>
      </div>

      <div className="row">
        <div className="dv-field">
          <label className="lbl" htmlFor="state">State</label>
          <select
            id="state"
            className="dv-input"
            value={value.StateOrProvince}
            onChange={(e) => onStateChange(e.target.value)}
          >
            {NG_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="dv-field">
          <label className="lbl" htmlFor="postcode">
            Postal code <span className="opt">(optional)</span>
          </label>
          <input
            id="postcode"
            className="dv-input mono"
            placeholder="106104"
            inputMode="numeric"
            maxLength={6}
            value={value.PostalCode}
            onChange={(e) => onPostalChange(e.target.value)}
          />
          {postalInvalid && (
            <span className="help">Postal code must be 6 digits.</span>
          )}
        </div>
      </div>
    </div>
  );
}
