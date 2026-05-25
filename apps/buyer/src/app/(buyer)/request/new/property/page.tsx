'use client';

import { useRouter } from 'next/navigation';
import { useRequestDraft } from '@/lib/hooks/useRequestDraft';
import type { RequestProperty } from '@/lib/types/request';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { CategorySelector } from '@/components/wizard/CategorySelector';
import { LandSubCategorySelector } from '@/components/wizard/LandSubCategorySelector';
import { HouseStyleSelector } from '@/components/wizard/HouseStyleSelector';
import { ApartmentStyleSelector } from '@/components/wizard/ApartmentStyleSelector';
import { BedsBathsSelector } from '@/components/wizard/BedsBathsSelector';
import { BQToggle } from '@/components/wizard/BQToggle';
import { derivePropertySubType, type UICategory } from '@verity/reso';

export default function PropertyStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useRequestDraft();
  const p = draft.property;
  const cat = p.category;

  const isHouse     = cat === 'ResidentialHouse';
  const isApartment = cat === 'ApartmentFlat';
  const isStudio    = isApartment && p.apartmentStyle === 'Studio';
  const showsBQ        = isHouse || isApartment;
  // Studio implies 0 bedrooms + 1 full bath — no user input needed.
  const showsBedsBaths = isHouse || (isApartment && !!p.apartmentStyle && !isStudio);
  const showsBedrooms  = showsBedsBaths;
  const showsHalfBaths = showsBedsBaths;

  const bedsBathsValid =
    !showsBedsBaths || (!!p.BedroomsTotal && !!p.BathroomsFull);

  const level2Valid =
    cat === 'LandedProperty' ? !!p.landSubCategory :
    cat === 'ResidentialHouse' ? !!p.houseStyle && !!p.houseAttachment :
    cat === 'ApartmentFlat' ? !!p.apartmentStyle :
    false;

  const bqValid = !p.hasBQ || !!p.bqConfig;
  const geoValid = !!p.UnparsedAddress.trim() && !!p.CountyOrParish.trim();

  const valid = !!cat && level2Valid && bedsBathsValid && bqValid && geoValid;

  function patchProperty(patch: Partial<RequestProperty>) {
    update((d) => ({ ...d, property: { ...d.property, ...patch } }));
  }

  function onCategoryChange(next: UICategory) {
    patchProperty({
      category: next,
      landSubCategory: null,
      landFeatures: [],
      houseStyle: null,
      houseAttachment: null,
      apartmentStyle: null,
      BedroomsTotal: undefined,
      BathroomsFull: undefined,
      BathroomsHalf: undefined,
      hasBQ: false,
      bqConfig: null,
      bqSeparateTitle: false,
      Verity_NG_BQBedroomsTotal: undefined,
      Verity_NG_BQBathroomsFull: undefined,
      Verity_NG_BQBathroomsHalf: undefined,
    });
  }

  function onContinue() {
    if (!valid || !cat) return;
    try {
      if (cat === 'LandedProperty' && p.landSubCategory) {
        derivePropertySubType({ category: 'LandedProperty', landSubCategory: p.landSubCategory });
      } else if (cat === 'ResidentialHouse' && p.houseStyle && p.houseAttachment) {
        derivePropertySubType({ category: 'ResidentialHouse', houseStyle: p.houseStyle, attachment: p.houseAttachment });
      } else if (cat === 'ApartmentFlat' && p.apartmentStyle) {
        derivePropertySubType({ category: 'ApartmentFlat', apartmentStyle: p.apartmentStyle });
      }
    } catch (err) {
      console.error('derivePropertySubType failed', err);
      return;
    }
    router.push('/request/new/documents');
  }

  return (
    <>
      <div className="bf-eyebrow" style={{ marginBottom: 10 }}>— Property details</div>
      <h2 className="bf-h2">
        Tell us about <em className="bf-italic">the property</em> you want verified.
      </h2>
      <p className="bf-body" style={{ fontStyle: 'italic', color: 'var(--slate)', marginTop: 6, maxWidth: '56ch' }}>
        A few quick selections — the category shapes what evidence we'll need for verification.
      </p>

      <div className="bf-stack" style={{ gap: 24, marginTop: 24, maxWidth: 880 }}>
        <section>
          <SectionLabel>Property category</SectionLabel>
          <CategorySelector value={cat} onChange={onCategoryChange} />
        </section>

        {cat === 'LandedProperty' && (
          <section>
            <SectionLabel>Land sub-category</SectionLabel>
            <LandSubCategorySelector
              value={p.landSubCategory}
              onChange={(v) => patchProperty({ landSubCategory: v })}
              features={p.landFeatures}
              onFeaturesChange={(v) => patchProperty({ landFeatures: v })}
            />
          </section>
        )}

        {cat === 'ResidentialHouse' && (
          <section>
            <SectionLabel>Style &amp; attachment</SectionLabel>
            <HouseStyleSelector
              style={p.houseStyle}
              attachment={p.houseAttachment}
              onStyleChange={(v) => patchProperty({ houseStyle: v })}
              onAttachmentChange={(v) => patchProperty({ houseAttachment: v })}
            />
          </section>
        )}

        {cat === 'ApartmentFlat' && (
          <section>
            <SectionLabel>Apartment style</SectionLabel>
            <ApartmentStyleSelector
              value={p.apartmentStyle}
              onChange={(v) => {
                // Studio implies 0 bedrooms + 1 full bath (set at submit time);
                // clear any prior user-entered beds/baths state.
                if (v === 'Studio') {
                  patchProperty({ apartmentStyle: v, BedroomsTotal: undefined, BathroomsFull: undefined, BathroomsHalf: undefined });
                } else {
                  patchProperty({ apartmentStyle: v });
                }
              }}
            />
          </section>
        )}

        {showsBedsBaths && (
          <section>
            <SectionLabel>Bedrooms &amp; bathrooms</SectionLabel>
            <BedsBathsSelector
              showBedrooms={showsBedrooms}
              showHalfBaths={showsHalfBaths}
              bedrooms={p.BedroomsTotal ?? null}
              bathroomsFull={p.BathroomsFull ?? null}
              bathroomsHalf={p.BathroomsHalf ?? null}
              onBedroomsChange={(v) => patchProperty({ BedroomsTotal: v })}
              onBathroomsFullChange={(v) => patchProperty({ BathroomsFull: v })}
              onBathroomsHalfChange={(v) => patchProperty({ BathroomsHalf: v })}
            />
          </section>
        )}

        {showsBQ && (
          <section>
            <SectionLabel>Boys&apos; Quarters</SectionLabel>
            <BQToggle
              hasBQ={p.hasBQ}
              bqConfig={p.bqConfig}
              bqSeparateTitle={p.bqSeparateTitle}
              bqBedrooms={p.Verity_NG_BQBedroomsTotal ?? null}
              bqBathFull={p.Verity_NG_BQBathroomsFull ?? null}
              bqBathHalf={p.Verity_NG_BQBathroomsHalf ?? null}
              onHasBQChange={(v) =>
                patchProperty({
                  hasBQ: v,
                  bqConfig: v ? p.bqConfig : null,
                  bqSeparateTitle: v ? p.bqSeparateTitle : false,
                  Verity_NG_BQBedroomsTotal: v ? p.Verity_NG_BQBedroomsTotal : undefined,
                  Verity_NG_BQBathroomsFull: v ? p.Verity_NG_BQBathroomsFull : undefined,
                  Verity_NG_BQBathroomsHalf: v ? p.Verity_NG_BQBathroomsHalf : undefined,
                })
              }
              onConfigChange={(v) => patchProperty({ bqConfig: v })}
              onSeparateTitleChange={(v) => patchProperty({ bqSeparateTitle: v })}
              onBQBedroomsChange={(v) => patchProperty({ Verity_NG_BQBedroomsTotal: v })}
              onBQBathFullChange={(v) => patchProperty({ Verity_NG_BQBathroomsFull: v })}
              onBQBathHalfChange={(v) => patchProperty({ Verity_NG_BQBathroomsHalf: v })}
            />
          </section>
        )}

        <section>
          <SectionLabel>Location &amp; size</SectionLabel>
          <div className="bf-stack" style={{ gap: 14 }}>
            <div className="bf-grid-2">
              <div className="bf-field">
                <label className="bf-label">State *</label>
                <div className="bf-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Lagos</span>
                  <span className="bf-mono" style={{ color: 'var(--slate)', fontSize: 10 }}>NG-LA</span>
                </div>
              </div>
              <div className="bf-field">
                <label className="bf-label" htmlFor="lga">Local Government Area *</label>
                <input
                  id="lga"
                  className="bf-input"
                  value={p.CountyOrParish}
                  placeholder="Eti-Osa"
                  onChange={(e) => patchProperty({ CountyOrParish: e.target.value })}
                />
              </div>
            </div>

            <div className="bf-field">
              <label className="bf-label" htmlFor="address">Plot address *</label>
              <textarea
                id="address"
                className="bf-textarea"
                value={p.UnparsedAddress}
                placeholder="Plot 27B, Admiralty Way, Lekki Phase 1, Lagos."
                onChange={(e) => patchProperty({ UnparsedAddress: e.target.value })}
              />
            </div>

            <div className="bf-grid-2">
              <div className="bf-field">
                <label className="bf-label" htmlFor="plotNo">
                  Plot no. <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span>
                </label>
                <input
                  id="plotNo"
                  className="bf-input mono"
                  value={p.Verity_PlotNo || ''}
                  placeholder="LEK/PH1/27B"
                  onChange={(e) => patchProperty({ Verity_PlotNo: e.target.value || undefined })}
                />
              </div>
              <div className="bf-field">
                <label className="bf-label" htmlFor="sizeSqm">
                  Lot size (m²) <span style={{ fontSize: 10, color: 'var(--slate)' }}>(optional)</span>
                </label>
                <input
                  id="sizeSqm"
                  className="bf-input mono"
                  type="number"
                  value={p.LotSizeSquareMeters ?? ''}
                  placeholder="640"
                  onChange={(e) => patchProperty({ LotSizeSquareMeters: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <WizardFooter
        primary={{
          label: <>Continue <span className="arrow">→</span></>,
          onClick: onContinue,
          disabled: !hydrated || !valid,
        }}
      />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bf-mono"
      style={{
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--gold-deep)',
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}
