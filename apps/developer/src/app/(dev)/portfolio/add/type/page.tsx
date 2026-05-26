'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WizardCard } from '@/components/wizard/WizardCard';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { AddressSection } from '@/components/wizard/AddressSection';
import { ApartmentStyleSelector } from '@/components/wizard/ApartmentStyleSelector';
import { BedsBathsSelector } from '@/components/wizard/BedsBathsSelector';
import { BQToggle } from '@/components/wizard/BQToggle';
import { CategorySelector } from '@/components/wizard/CategorySelector';
import { HouseStyleSelector } from '@/components/wizard/HouseStyleSelector';
import { LandSubCategorySelector } from '@/components/wizard/LandSubCategorySelector';
import { LivingAreaSection } from '@/components/wizard/LivingAreaSection';
import { LotSizeSection } from '@/components/wizard/LotSizeSection';
import { commitDraft, loadDraft, useAddPropertyDraft } from '@/lib/hooks/useAddPropertyDraft';
import { derivePropertySubType, type UICategory } from '@verity/reso';
import type { FlatNumberMode } from '@/components/wizard/AddressSection';

export default function TypeStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeVpid = searchParams.get('draft');
  const { draft, update, hydrated, hydrateFromRecord } = useAddPropertyDraft();

  // Resume flow: if ?draft=DRAFT-XYZ is in the URL, hydrate the wizard from
  // that saved record exactly once on mount. The resumed vpid is stashed in
  // sessionStorage so the review step can pass it to submit() for cleanup.
  useEffect(() => {
    if (!hydrated || !resumeVpid) return;
    const saved = loadDraft(resumeVpid);
    if (saved) {
      hydrateFromRecord(saved);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('verity:dev-add-resume-vpid', resumeVpid);
      }
    }
  }, [hydrated, resumeVpid, hydrateFromRecord]);

  const cat = draft.category;
  const isHouse     = cat === 'ResidentialHouse';
  const isApartment = cat === 'ApartmentFlat';
  const isStudio    = isApartment && draft.apartmentStyle === 'Studio';
  const showsBQ        = isHouse || isApartment;
  // Studio implies 0 bedrooms + 1 full bath — no user input needed.
  const showsBedsBaths = isHouse || (isApartment && !!draft.apartmentStyle && !isStudio);
  const showsBedrooms  = showsBedsBaths;
  const showsHalfBaths = showsBedsBaths;

  const bedsBathsValid =
    !showsBedsBaths || (!!draft.BedroomsTotal && !!draft.BathroomsFull);

  const level2Valid =
    cat === 'LandedProperty' ? !!draft.landSubCategory :
    cat === 'ResidentialHouse' ? !!draft.houseStyle && !!draft.houseAttachment :
    cat === 'ApartmentFlat' ? !!draft.apartmentStyle :
    false;

  const bqValid = !draft.hasBQ || !!draft.bqConfig;

  // Address Capture §4.6 — flat/unit number visibility + requirement by category.
  const flatNumberMode: FlatNumberMode =
    cat === 'ApartmentFlat'  ? 'required' :
    cat === 'LandedProperty' ? 'hidden'   :
    'optional';
  const unitNumberValid = flatNumberMode !== 'required' || !!draft.UnitNumber.trim();

  const addressValid =
    !!draft.streetAddressInput.trim() &&
    !!draft.City.trim() &&
    !!draft.CountyOrParish.trim() &&
    !!draft.StateOrProvince.trim() &&
    (draft.PostalCode === '' || /^\d{6}$/.test(draft.PostalCode));

  // Area & Measurement §4 — required fields per category.
  const lotValid =
    cat === 'ApartmentFlat' ? true :
    !!draft.LotSizeArea && !!draft.LotSizeUnits && !!draft.LotSizeSource;
  const livingValid =
    cat === 'LandedProperty' ? true :
    !!draft.LivingArea && !!draft.LivingAreaSource;
  const sizeValid = lotValid && livingValid;

  const valid =
    !!cat && level2Valid && bedsBathsValid && bqValid && addressValid && unitNumberValid && sizeValid;

  function onCategoryChange(next: UICategory) {
    // Reset Level-2, beds/baths, and BQ selections when category changes.
    // Also clear category-incompatible area + unit-number fields per Area §4 and Address §4.6.
    const clearsLot     = next === 'ApartmentFlat';
    const clearsLiving  = next === 'LandedProperty';
    const clearsUnitNum = next === 'LandedProperty';
    update({
      category: next,
      landSubCategory: null,
      landFeatures: [],
      houseStyle: null,
      houseAttachment: null,
      apartmentStyle: null,
      BedroomsTotal: null,
      BathroomsFull: null,
      BathroomsHalf: null,
      hasBQ: false,
      bqConfig: null,
      bqSeparateTitle: false,
      Verity_NG_BQBedroomsTotal: null,
      Verity_NG_BQBathroomsFull: null,
      Verity_NG_BQBathroomsHalf: null,
      ...(clearsUnitNum && { UnitNumber: '' }),
      ...(clearsLot && {
        LotSizeArea: null, LotSizeUnits: null, LotSizeDimensions: '', LotSizeSource: null,
      }),
      ...(clearsLiving && {
        LivingArea: null, LivingAreaSource: null,
      }),
    });
  }

  function onContinue() {
    if (!valid || !cat) return;
    // Defence-in-depth: pre-compute derivePropertySubType so a bad combo fails fast.
    try {
      if (cat === 'LandedProperty' && draft.landSubCategory) {
        derivePropertySubType({ category: 'LandedProperty', landSubCategory: draft.landSubCategory });
      } else if (cat === 'ResidentialHouse' && draft.houseStyle && draft.houseAttachment) {
        derivePropertySubType({ category: 'ResidentialHouse', houseStyle: draft.houseStyle, attachment: draft.houseAttachment });
      } else if (cat === 'ApartmentFlat' && draft.apartmentStyle) {
        derivePropertySubType({ category: 'ApartmentFlat', apartmentStyle: draft.apartmentStyle });
      }
    } catch (err) {
      console.error('derivePropertySubType failed', err);
      return;
    }
    router.push('/portfolio/add/documents');
  }

  return (
    <WizardCard
      slug="type"
      title={<>What is <em>this property</em> and where?</>}
      lede="The category drives how we verify and what evidence we'll ask for."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 22 }}>
        <section>
          <SectionLabel>Property category</SectionLabel>
          <CategorySelector value={cat} onChange={onCategoryChange} />
        </section>

        {cat === 'LandedProperty' && (
          <section>
            <SectionLabel>Land sub-category</SectionLabel>
            <LandSubCategorySelector
              value={draft.landSubCategory}
              onChange={(v) => update({ landSubCategory: v })}
              features={draft.landFeatures}
              onFeaturesChange={(v) => update({ landFeatures: v })}
            />
          </section>
        )}

        {cat === 'ResidentialHouse' && (
          <section>
            <SectionLabel>Style &amp; attachment</SectionLabel>
            <HouseStyleSelector
              style={draft.houseStyle}
              attachment={draft.houseAttachment}
              onStyleChange={(v) => update({ houseStyle: v })}
              onAttachmentChange={(v) => update({ houseAttachment: v })}
            />
          </section>
        )}

        {cat === 'ApartmentFlat' && (
          <section>
            <SectionLabel>Apartment style</SectionLabel>
            <ApartmentStyleSelector
              value={draft.apartmentStyle}
              onChange={(v) => {
                // Studio implies 0 bedrooms + 1 full bath (set at submit time);
                // clear any prior user-entered beds/baths state.
                if (v === 'Studio') {
                  update({ apartmentStyle: v, BedroomsTotal: null, BathroomsFull: null, BathroomsHalf: null });
                } else {
                  update({ apartmentStyle: v });
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
              bedrooms={draft.BedroomsTotal}
              bathroomsFull={draft.BathroomsFull}
              bathroomsHalf={draft.BathroomsHalf}
              onBedroomsChange={(v) => update({ BedroomsTotal: v })}
              onBathroomsFullChange={(v) => update({ BathroomsFull: v })}
              onBathroomsHalfChange={(v) => update({ BathroomsHalf: v })}
            />
          </section>
        )}

        {showsBQ && (
          <section>
            <SectionLabel>Boys&apos; Quarters</SectionLabel>
            <BQToggle
              hasBQ={draft.hasBQ}
              bqConfig={draft.bqConfig}
              bqSeparateTitle={draft.bqSeparateTitle}
              bqBedrooms={draft.Verity_NG_BQBedroomsTotal}
              bqBathFull={draft.Verity_NG_BQBathroomsFull}
              bqBathHalf={draft.Verity_NG_BQBathroomsHalf}
              onHasBQChange={(v) =>
                update({
                  hasBQ: v,
                  // Clear all BQ sub-fields when toggling off so we don't keep stale state.
                  bqConfig: v ? draft.bqConfig : null,
                  bqSeparateTitle: v ? draft.bqSeparateTitle : false,
                  Verity_NG_BQBedroomsTotal: v ? draft.Verity_NG_BQBedroomsTotal : null,
                  Verity_NG_BQBathroomsFull: v ? draft.Verity_NG_BQBathroomsFull : null,
                  Verity_NG_BQBathroomsHalf: v ? draft.Verity_NG_BQBathroomsHalf : null,
                })
              }
              onConfigChange={(v) => update({ bqConfig: v })}
              onSeparateTitleChange={(v) => update({ bqSeparateTitle: v })}
              onBQBedroomsChange={(v) => update({ Verity_NG_BQBedroomsTotal: v })}
              onBQBathFullChange={(v) => update({ Verity_NG_BQBathroomsFull: v })}
              onBQBathHalfChange={(v) => update({ Verity_NG_BQBathroomsHalf: v })}
            />
          </section>
        )}

        <section>
          <SectionLabel>Property address</SectionLabel>
          <AddressSection
            value={{
              streetAddressInput: draft.streetAddressInput,
              Verity_NG_PlotNumber: draft.Verity_NG_PlotNumber,
              Verity_NG_Neighborhood: draft.Verity_NG_Neighborhood,
              UnitNumber: draft.UnitNumber,
              City: draft.City,
              CountyOrParish: draft.CountyOrParish,
              StateOrProvince: draft.StateOrProvince,
              PostalCode: draft.PostalCode,
            }}
            onChange={(patch) => update(patch)}
            flatNumberMode={flatNumberMode}
          />
        </section>

        <LotSizeSection
          category={cat}
          value={{
            LotSizeArea: draft.LotSizeArea,
            LotSizeUnits: draft.LotSizeUnits,
            LotSizeDimensions: draft.LotSizeDimensions,
            LotSizeSource: draft.LotSizeSource,
          }}
          onChange={(patch) => update(patch)}
        />

        <LivingAreaSection
          category={cat}
          value={{
            LivingArea: draft.LivingArea,
            LivingAreaSource: draft.LivingAreaSource,
          }}
          onChange={(patch) => update(patch)}
        />
      </div>

      <WizardFooter
        primary={{
          label: <>Continue · documents <span className="arrow">→</span></>,
          onClick: onContinue,
          disabled: !hydrated || !valid,
        }}
        saveDraft={{
          // Need at least a category before a draft is meaningful in the portfolio.
          disabled: !hydrated || !cat,
          onClick: () => {
            const { vpid } = commitDraft(draft, resumeVpid ?? undefined);
            router.push(`/portfolio?just-saved=${vpid}`);
          },
        }}
      />
    </WizardCard>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--f-meta)',
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
