'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardCard } from '@/components/wizard/WizardCard';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { ResoTag } from '@/components/property/ResoTag';
import { commitDraft, useAddPropertyDraft } from '@/lib/hooks/useAddPropertyDraft';
import { propertyService } from '@/lib/services';
import { DOCUMENT_LABELS, type DocumentSlot } from '@/lib/types/add';
import {
  derivePropertySubType,
  parseStreetAddress,
  toSquareMeters,
  UI_CATEGORY_LABEL,
  type DeriveInput,
  type DeriveOutput,
} from '@verity/reso';

type Row = { label: string; field: string; value: React.ReactNode };

export default function ReviewStep() {
  const router = useRouter();
  const { draft, clear, hydrated } = useAddPropertyDraft();
  const [submitting, setSubmitting] = useState(false);

  const docCount = Object.keys(draft.documents).length;

  // Build the derive input from the draft. If incomplete, leave derived null
  // so the review still renders gracefully.
  const derive: DeriveInput | null =
    draft.category === 'LandedProperty' && draft.landSubCategory
      ? { category: 'LandedProperty', landSubCategory: draft.landSubCategory }
    : draft.category === 'ResidentialHouse' && draft.houseStyle && draft.houseAttachment
      ? { category: 'ResidentialHouse', houseStyle: draft.houseStyle, attachment: draft.houseAttachment }
    : draft.category === 'ApartmentFlat' && draft.apartmentStyle
      ? { category: 'ApartmentFlat', apartmentStyle: draft.apartmentStyle }
      : null;

  const derived: DeriveOutput | null = derive ? derivePropertySubType(derive) : null;

  const street = parseStreetAddress(draft.streetAddressInput);

  const rows: Row[] = [
    { label: 'Category',           field: '—',                            value: draft.category ? UI_CATEGORY_LABEL[draft.category] : '—' },
    { label: 'Property type',      field: 'PropertyType',                 value: derived?.PropertyType ?? '—' },
    { label: 'Property sub-type',  field: 'PropertySubType',              value: derived?.PropertySubType ?? '—' },
  ];

  // Address Capture v1 — parsed RESO street + locality
  if (street.StreetNumber) rows.push({ label: 'Street number', field: 'StreetNumber', value: street.StreetNumber });
  if (street.StreetName)   rows.push({ label: 'Street name',   field: 'StreetName',   value: street.StreetName });
  if (street.StreetSuffix) rows.push({ label: 'Street suffix', field: 'StreetSuffix', value: street.StreetSuffix });
  if (draft.UnitNumber)    rows.push({ label: 'Unit number',   field: 'UnitNumber',   value: draft.UnitNumber });
  if (draft.Verity_NG_PlotNumber)
    rows.push({ label: 'Plot number', field: 'Verity_NG_PlotNumber', value: draft.Verity_NG_PlotNumber });
  if (draft.Verity_NG_Neighborhood)
    rows.push({ label: 'Neighbourhood', field: 'Verity_NG_Neighborhood', value: draft.Verity_NG_Neighborhood });
  rows.push({ label: 'City',     field: 'City',           value: draft.City || '—' });
  rows.push({ label: 'LGA',      field: 'CountyOrParish', value: draft.CountyOrParish || '—' });
  rows.push({ label: 'State',    field: 'StateOrProvince', value: draft.StateOrProvince });
  if (draft.PostalCode)
    rows.push({ label: 'Postal code', field: 'PostalCode', value: draft.PostalCode });

  // Area & Measurement v1 §4 — category-conditional area rows.
  if (draft.category !== 'ApartmentFlat') {
    const lotLabel = draft.category === 'LandedProperty' ? 'Lot' : 'Plot';
    rows.push({ label: `${lotLabel} area`, field: 'LotSizeArea',
      value: draft.LotSizeArea != null ? draft.LotSizeArea.toLocaleString() : '—' });
    rows.push({ label: `${lotLabel} units`, field: 'LotSizeUnits',
      value: draft.LotSizeUnits ?? '—' });
    if (draft.LotSizeDimensions) {
      rows.push({ label: `${lotLabel} dimensions`, field: 'LotSizeDimensions',
        value: draft.LotSizeDimensions });
    }
    rows.push({ label: `${lotLabel} source`, field: 'LotSizeSource',
      value: draft.LotSizeSource ?? '—' });
    if (draft.LotSizeArea && draft.LotSizeUnits && draft.LotSizeUnits !== 'SquareMeters') {
      rows.push({ label: 'Normalized', field: 'LotSizeSquareMeters',
        value: `${toSquareMeters(draft.LotSizeArea, draft.LotSizeUnits).toLocaleString()} m²` });
    }
  }

  if (draft.category === 'ResidentialHouse' || draft.category === 'ApartmentFlat') {
    rows.push({ label: 'Living area', field: 'LivingArea',
      value: draft.LivingArea ? `${draft.LivingArea.toLocaleString()} m²` : '—' });
    rows.push({ label: 'Living source', field: 'LivingAreaSource',
      value: draft.LivingAreaSource ?? '—' });
  }

  if (draft.category === 'LandedProperty') {
    rows.push({ label: 'Land zoning', field: 'Verity_NG_LandZoning', value: derived?.Verity_NG_LandZoning ?? '—' });
    if (draft.landFeatures.length > 0) {
      rows.push({ label: 'Land feature', field: 'Verity_NG_LandFeature', value: draft.landFeatures.join(', ') });
    }
  }
  if (draft.category === 'ResidentialHouse') {
    rows.push({ label: 'House style', field: 'Verity_NG_HouseStyle',      value: draft.houseStyle ?? '—' });
    rows.push({ label: 'Attachment',  field: 'Verity_NG_HouseAttachment', value: draft.houseAttachment ?? '—' });
  }
  if (draft.category === 'ApartmentFlat') {
    rows.push({ label: 'Apartment style', field: 'Verity_NG_ApartmentStyle', value: draft.apartmentStyle ?? '—' });
  }

  // Beds + baths — apply to House and to Apartment (bedrooms hidden for Studio).
  const showsBeds = draft.category === 'ResidentialHouse' || (draft.category === 'ApartmentFlat' && draft.apartmentStyle !== 'Studio');
  if (showsBeds && draft.BedroomsTotal) {
    rows.push({
      label: 'Bedrooms',
      field: 'BedroomsTotal',
      value: draft.BedroomsTotal >= 5 ? '5+' : String(draft.BedroomsTotal),
    });
  }
  if (draft.BathroomsFull) {
    rows.push({
      label: 'Full bathrooms',
      field: 'BathroomsFull',
      value: draft.BathroomsFull >= 5 ? '5+' : String(draft.BathroomsFull),
    });
    if (draft.BathroomsHalf && draft.BathroomsHalf > 0) {
      rows.push({
        label: 'Half bathrooms',
        field: 'BathroomsHalf',
        value: draft.BathroomsHalf >= 3 ? '3+' : String(draft.BathroomsHalf),
      });
    }
    rows.push({
      label: 'Total bathrooms',
      field: 'BathroomsTotalDecimal',
      value: (draft.BathroomsFull + (draft.BathroomsHalf ?? 0) * 0.5).toFixed(1),
    });
  }
  if (draft.hasBQ) {
    rows.push({ label: 'Boys\' Quarters',   field: 'Verity_NG_HasBQ',           value: 'Yes' });
    rows.push({ label: 'BQ config',         field: 'Verity_NG_BQConfig',        value: draft.bqConfig ?? '—' });
    rows.push({ label: 'BQ separate title', field: 'Verity_NG_BQSeparateTitle', value: draft.bqSeparateTitle ? 'Yes' : 'No' });
    if (draft.Verity_NG_BQBedroomsTotal !== null) {
      rows.push({
        label: 'BQ bedrooms',
        field: 'Verity_NG_BQBedroomsTotal',
        value: draft.Verity_NG_BQBedroomsTotal >= 4 ? '4+' : String(draft.Verity_NG_BQBedroomsTotal),
      });
    }
    if (draft.Verity_NG_BQBathroomsFull !== null) {
      rows.push({
        label: 'BQ full bathrooms',
        field: 'Verity_NG_BQBathroomsFull',
        value: draft.Verity_NG_BQBathroomsFull >= 2 ? '2+' : String(draft.Verity_NG_BQBathroomsFull),
      });
    }
    if (draft.Verity_NG_BQBathroomsHalf !== null && draft.Verity_NG_BQBathroomsHalf > 0) {
      rows.push({
        label: 'BQ half bathrooms',
        field: 'Verity_NG_BQBathroomsHalf',
        value: draft.Verity_NG_BQBathroomsHalf >= 1 ? '1+' : String(draft.Verity_NG_BQBathroomsHalf),
      });
    }
  }

  rows.push({ label: 'Documents', field: '—', value: `${docCount} of 4 attached` });
  rows.push({ label: 'Tier',      field: '—', value: draft.tier === 'premium' ? 'Premium · cohort credit' : 'Standard · cohort credit' });

  async function onSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const fromDraftVpid =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem('verity:dev-add-resume-vpid') || undefined
        : undefined;
    const { vpid } = await propertyService.submit(draft, { fromDraftVpid });
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('verity:dev-add-resume-vpid');
    }
    clear();
    router.push(`/portfolio/${vpid}?just-added=1`);
  }

  return (
    <WizardCard
      slug="review"
      title={<>Review and <em>submit</em>.</>}
      lede="Once you submit, we'll start the verification workflow. You'll receive an email when each stage completes."
    >
      {draft.bqSeparateTitle && (
        <div className="alert alert-warning" style={{ marginTop: 18 }}>
          <span className="alert-icon">!</span>
          <div>
            <strong>BQ separate title flagged.</strong>
            The BQ title document must be uploaded and verified independently. Our analyst team will reach
            out within 24 hours.
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, border: '1px solid var(--line)', background: '#fff' }}>
        {rows.map((r, i) => (
          <div
            key={`${r.label}-${i}`}
            style={{
              padding: '14px 18px',
              borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              alignItems: 'baseline',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                {r.label}
              </span>
              {r.field !== '—' && <ResoTag field={r.field} />}
            </span>
            <span style={{ fontSize: 13, color: 'var(--navy)', textAlign: 'right' }}>{r.value}</span>
          </div>
        ))}
      </div>

      {docCount > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>Attached documents</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(Object.keys(draft.documents) as DocumentSlot[]).map((slot) => (
              <li key={slot} style={{ fontFamily: 'var(--f-meta)', fontSize: 11, color: 'var(--navy)', letterSpacing: '0.06em' }}>
                <span style={{ color: '#4F8F4F', marginRight: 6 }}>✓</span>
                {DOCUMENT_LABELS[slot].label} — {draft.documents[slot]?.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <WizardFooter
        back={{ href: '/portfolio/add/tier', label: 'Back to tier' }}
        primary={{
          label: submitting ? 'Submitting…' : <>Submit for verification <span className="arrow">→</span></>,
          onClick: onSubmit,
          disabled: !hydrated || submitting,
          variant: 'gold',
        }}
        saveDraft={{
          disabled: !hydrated || submitting || !draft.category,
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
