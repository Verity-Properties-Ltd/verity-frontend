import type { PropertyDetail } from '@/lib/types/property';
import { ResoTag } from './ResoTag';

type Row = { label: string; field: string; value: React.ReactNode };

/**
 * Property overview grid — renders the canonical RESO + Verity_NG_* + Verity_*
 * field set with each field's RESO name surfaced via a <ResoTag /> pill
 * (brief §9.5).
 */
export function PropertyOverview({ property }: { property: PropertyDetail }) {
  const rows: Row[] = [];

  function push(field: string, label: string, value: React.ReactNode) {
    if (value === undefined || value === null || value === '') return;
    rows.push({ label, field, value });
  }

  // Identification
  push('Verity_VPID',      'VPID',             property.Verity_VPID);
  push('ListingKey',       'Listing key',      property.ListingKey);
  push('PropertyType',     'Property type',    property.PropertyType);
  push('PropertySubType',  'Property sub-type', property.PropertySubType);
  push('StandardStatus',   'Status',           property.StandardStatus);

  // Geo
  push('UnparsedAddress',  'Address',          property.UnparsedAddress);
  push('CountyOrParish',   'LGA',              property.CountyOrParish);
  push('StateOrProvince',  'State',            property.StateOrProvince);
  push('Country',          'Country',          property.Country);
  push('LotSizeSquareMeters', 'Lot size',
    property.LotSizeSquareMeters ? `${property.LotSizeSquareMeters.toLocaleString()} m²` : undefined);
  push('BedroomsTotal',    'Bedrooms',         property.BedroomsTotal);
  push('BathroomsFull',    'Full bathrooms',   property.BathroomsFull);
  push('BathroomsHalf',    'Half bathrooms',   property.BathroomsHalf && property.BathroomsHalf > 0 ? property.BathroomsHalf : undefined);
  push('BathroomsTotalDecimal', 'Bathrooms (total)',
    property.BathroomsTotalDecimal !== undefined
      ? property.BathroomsTotalDecimal.toFixed(1)
      : property.BathroomsFull !== undefined
        ? (property.BathroomsFull + (property.BathroomsHalf ?? 0) * 0.5).toFixed(1)
        : undefined);

  // Verity_NG_*
  push('Verity_NG_HouseStyle',      'House style',     property.Verity_NG_HouseStyle);
  push('Verity_NG_HouseAttachment', 'Attachment',      property.Verity_NG_HouseAttachment);
  push('Verity_NG_ApartmentStyle',  'Apartment style', property.Verity_NG_ApartmentStyle);
  push('Verity_NG_LandZoning',      'Land zoning',     property.Verity_NG_LandZoning);
  if (property.Verity_NG_LandFeature && property.Verity_NG_LandFeature !== 'None') {
    push('Verity_NG_LandFeature',   'Land feature',    property.Verity_NG_LandFeature);
  }
  if (property.Verity_NG_HasBQ) {
    push('Verity_NG_HasBQ',     'Boys\' Quarters', 'Yes');
    push('Verity_NG_BQConfig',  'BQ configuration', property.Verity_NG_BQConfig);
    push('Verity_NG_BQSeparateTitle', 'BQ separate title',
      property.Verity_NG_BQSeparateTitle ? 'Yes' : 'No');
    push('Verity_NG_BQBedroomsTotal',  'BQ bedrooms',      property.Verity_NG_BQBedroomsTotal);
    push('Verity_NG_BQBathroomsFull',  'BQ full bathrooms', property.Verity_NG_BQBathroomsFull);
    push('Verity_NG_BQBathroomsHalf',  'BQ half bathrooms', property.Verity_NG_BQBathroomsHalf);
  }

  // Verity_* (title)
  push('Verity_TitleType',       'Title type',       property.Verity_TitleType);
  push('Verity_CofONumber',      'C of O number',    property.Verity_CofONumber);
  push('Verity_RegisteredOwner', 'Registered owner', property.Verity_RegisteredOwner);
  push('Verity_TitleIssueDate',  'Title issued',     property.Verity_TitleIssueDate);
  push('Verity_LGA',             'LGA (registered)', property.Verity_LGA);
  push('Verity_ConfidenceScore', 'Confidence score',
    property.Verity_ConfidenceScore !== undefined ? `${property.Verity_ConfidenceScore} / 100` : undefined);

  return (
    <div>
      {property.Verity_NG_BQSeparateTitle && (
        <div className="alert alert-warning" style={{ marginBottom: 18 }}>
          <span className="alert-icon">!</span>
          <div>
            <strong>BQ may have a separate title.</strong>
            This property&apos;s BQ may have a separate title. Additional verification underway —
            the BQ title document must be uploaded and verified independently.
          </div>
        </div>
      )}
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 4 }}>
        {rows.map((r, i) => (
          <div
            key={r.field}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 220px) 1fr',
              gap: 16,
              padding: '12px 18px',
              borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none',
              alignItems: 'baseline',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--f-meta)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--slate)',
                }}
              >
                {r.label}
              </span>
              <ResoTag field={r.field} />
            </div>
            <div style={{ fontSize: 14, color: 'var(--navy)' }}>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
