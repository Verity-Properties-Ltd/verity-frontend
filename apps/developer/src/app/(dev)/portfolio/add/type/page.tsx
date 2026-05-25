'use client';

import { useRouter } from 'next/navigation';
import { WizardCard } from '@/components/wizard/WizardCard';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { ApartmentStyleSelector } from '@/components/wizard/ApartmentStyleSelector';
import { BQToggle } from '@/components/wizard/BQToggle';
import { CategorySelector } from '@/components/wizard/CategorySelector';
import { HouseStyleSelector } from '@/components/wizard/HouseStyleSelector';
import { LandSubCategorySelector } from '@/components/wizard/LandSubCategorySelector';
import { useAddPropertyDraft } from '@/lib/hooks/useAddPropertyDraft';
import { derivePropertySubType, type UICategory } from '@/lib/types/reso';

export default function TypeStep() {
  const router = useRouter();
  const { draft, update, hydrated } = useAddPropertyDraft();

  const cat = draft.category;
  const showsBQ = cat === 'ResidentialHouse' || cat === 'ApartmentFlat';

  const level2Valid =
    cat === 'LandedProperty' ? !!draft.landSubCategory :
    cat === 'ResidentialHouse' ? !!draft.houseStyle && !!draft.houseAttachment :
    cat === 'ApartmentFlat' ? !!draft.apartmentStyle :
    false;

  const bqValid = !draft.hasBQ || !!draft.bqConfig;
  const geoValid = !!draft.UnparsedAddress.trim() && !!draft.CountyOrParish.trim() && !!draft.LotSizeSquareMeters;

  const valid = !!cat && level2Valid && bqValid && geoValid;

  function onCategoryChange(next: UICategory) {
    // Reset Level-2 + BQ selections when category changes to keep state consistent.
    update({
      category: next,
      landSubCategory: null,
      landFeatures: [],
      houseStyle: null,
      houseAttachment: null,
      apartmentStyle: null,
      hasBQ: false,
      bqConfig: null,
      bqSeparateTitle: false,
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
      lede="The category drives how we verify — and which RESO PropertyType / PropertySubType your record will carry."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 22 }}>
        <section>
          <SectionLabel>1. Property category</SectionLabel>
          <CategorySelector value={cat} onChange={onCategoryChange} />
        </section>

        {cat === 'LandedProperty' && (
          <section>
            <SectionLabel>2. Land sub-category</SectionLabel>
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
            <SectionLabel>2. Style &amp; attachment</SectionLabel>
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
            <SectionLabel>2. Apartment style</SectionLabel>
            <ApartmentStyleSelector
              value={draft.apartmentStyle}
              onChange={(v) => update({ apartmentStyle: v })}
            />
          </section>
        )}

        {showsBQ && (
          <section>
            <SectionLabel>3. Boys&apos; Quarters</SectionLabel>
            <BQToggle
              hasBQ={draft.hasBQ}
              bqConfig={draft.bqConfig}
              bqSeparateTitle={draft.bqSeparateTitle}
              onHasBQChange={(v) =>
                update({
                  hasBQ: v,
                  // Clear sub-fields when toggling off so we don't keep stale state.
                  bqConfig: v ? draft.bqConfig : null,
                  bqSeparateTitle: v ? draft.bqSeparateTitle : false,
                })
              }
              onConfigChange={(v) => update({ bqConfig: v })}
              onSeparateTitleChange={(v) => update({ bqSeparateTitle: v })}
            />
          </section>
        )}

        <section>
          <SectionLabel>{showsBQ ? '4' : cat ? '3' : '2'}. Location &amp; size</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="dv-field full">
              <label className="lbl" htmlFor="address">Property address</label>
              <input
                id="address"
                className="dv-input"
                placeholder="Lekki Block A · Plot 12, Lekki Phase II"
                value={draft.UnparsedAddress}
                onChange={(e) => update({ UnparsedAddress: e.target.value })}
              />
            </div>
            <div className="row">
              <div className="dv-field">
                <label className="lbl">State (StateOrProvince)</label>
                <div className="dv-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Lagos</span>
                  <span style={{ fontFamily: 'var(--f-meta)', fontSize: 10, color: 'var(--slate)' }}>NG-LA</span>
                </div>
              </div>
              <div className="dv-field">
                <label className="lbl" htmlFor="lga">Local Government Area (CountyOrParish)</label>
                <input
                  id="lga"
                  className="dv-input"
                  placeholder="Eti-Osa"
                  value={draft.CountyOrParish}
                  onChange={(e) => update({ CountyOrParish: e.target.value })}
                />
              </div>
            </div>
            <div className="dv-field full">
              <label className="lbl" htmlFor="sizeSqm">Lot size (LotSizeSquareMeters)</label>
              <input
                id="sizeSqm"
                className="dv-input mono"
                type="number"
                placeholder="1250"
                value={draft.LotSizeSquareMeters ?? ''}
                onChange={(e) =>
                  update({ LotSizeSquareMeters: e.target.value ? Number(e.target.value) : null })
                }
              />
            </div>
          </div>
        </section>
      </div>

      <WizardFooter
        primary={{
          label: <>Continue · documents <span className="arrow">→</span></>,
          onClick: onContinue,
          disabled: !hydrated || !valid,
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
