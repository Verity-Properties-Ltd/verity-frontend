# VERITY RESO Area & Measurement Implementation v1

Created by: Ladi
Created time: May 25, 2026 7:49 PM
Category: Strategy doc
Last edited by: Ladi
Last updated time: May 25, 2026 7:49 PM

**RESO Area & Measurement Implementation Standard**

|  |  |
| --- | --- |
| **Version** | 1.0 — April 2026 |
| **Status** | Internal — Engineering, Product & Design Reference |
| **Scope** | RESO Data Dictionary v2.0 — area and measurement field implementation for VERITY MVP, covering lot size (land), living area (apartment/house interior), above-grade finished area, and unit handling for Nigerian context |
| **Owner** | Ladi Awolaja — CPO |
| **Source documents** | RESO Adoption Brief v1.1, RESO Bathroom Implementation v1.1, Address Capture v1, Tech Stack v1.1 (§2.2 schema), CTO Reference — Ruro v1.1 (§3), Designer Reference — Adebayo v1.1 (§5) |

*STRICTLY CONFIDENTIAL — INTERNAL DOCUMENT*

---

## 1. The Standard

RESO Data Dictionary v2.0 separates **land area** (lot/parcel size) from **building area** (the structure itself), with parallel Square Feet and Square Meters variants for each. The standard is internationally aware — non-US markets use the metric variants throughout. VERITY adopts metric (SquareMeters) as the canonical unit for all Nigerian residential property records, with explicit support for Hectares and Acres on land records where the source document uses them.

This document specifies which RESO area fields VERITY adopts in MVP, how unit consistency is enforced, how the three property categories (Land, Residential House, Apartment/Flat) populate area fields differently, and every MVP surface where area data is read or written.

---

## 2. The Two Field Families

RESO organises area fields into two distinct families. Confusing them is the most common implementation mistake.

### 2.1 Lot Size (Land Area)

Describes the **parcel of land** the property sits on.

| RESO Field | Type | Purpose | MVP? |
| --- | --- | --- | --- |
| `LotSizeArea` | DECIMAL(12,2) | Numeric lot area value | ✅ Yes |
| `LotSizeUnits` | VARCHAR(20) | Unit enum: SquareMeters, Hectares, Acres, SquareFeet | ✅ Yes |
| `LotSizeDimensions` | VARCHAR(100) | Free-text dimensions (e.g. "30m × 20m") | ✅ Yes |
| `LotSizeSource` | VARCHAR(30) | Provenance: Survey, Assessor, PublicRecords, Estimated, Owner, Builder | ✅ Yes |
| `LotSizeAcres` | DECIMAL(10,4) | Lot size in acres (US-conventional) | ❌ Phase 2 |
| `LotSizeSquareFeet` | DECIMAL(12,2) | Lot size in square feet | ❌ Phase 2 |
| `LotSizeSquareMeters` | DECIMAL(12,2) | Pre-computed sqm value | ❌ Deprecated in favor of LotSizeArea+Units |

### 2.2 Building / Living Area

Describes the **structure** on the parcel.

| RESO Field | Type | Purpose | MVP? |
| --- | --- | --- | --- |
| `LivingArea` | DECIMAL(10,2) | Total living area of the dwelling (habitable space) | ✅ Yes |
| `LivingAreaUnits` | VARCHAR(20) | Unit enum: SquareMeters, SquareFeet | ✅ Yes |
| `LivingAreaSource` | VARCHAR(30) | Provenance: Appraiser, Assessor, Builder, Owner, Plans, PublicRecords, Estimated, Other | ✅ Yes |
| `AboveGradeFinishedArea` | DECIMAL(10,2) | Finished area at or above ground level (bank LOS standard) | ✅ Yes |
| `AboveGradeFinishedAreaUnits` | VARCHAR(20) | Unit enum | ✅ Yes |
| `BuildingAreaTotal` | DECIMAL(10,2) | Total building area including unfinished portions | ✅ Yes |
| `BuildingAreaUnits` | VARCHAR(20) | Unit enum | ✅ Yes |
| `BelowGradeFinishedArea` | DECIMAL(10,2) | Finished area below ground (basements — rare in Nigeria) | ❌ Phase 2 |

### 2.3 The Distinction That Matters Most

- **`LivingArea`** is the colloquial answer to "how big is the house?" — finished, habitable space. Most consumer-facing.
- **`AboveGradeFinishedArea`** is the appraiser / bank-comparable view — the finished portion at or above ground level. Bank LOS systems prefer this.
- **`BuildingAreaTotal`** is the total footprint including garages, terraces, BQ outbuildings, unfinished spaces.

For Nigerian residential properties without basements, `LivingArea` and `AboveGradeFinishedArea` are typically identical values. VERITY populates both for institutional clarity even when they match.

---

## 3. Unit Conventions

### 3.1 The Critical Rule: Unit Consistency Within a Record

**Within a single property record, all area fields must use the same unit family.** You cannot have `LotSizeUnits = 'SquareMeters'` and `LivingAreaUnits = 'SquareFeet'` on the same record. Bank API consumers assume unit consistency within a record — a mixed-unit record breaks valuation comparables.

For Nigerian properties, the rule is even simpler: **SquareMeters everywhere** (with Hectares/Acres allowed only on Land records where the source document used them).

### 3.2 The Canonical Metric Pattern

```
LotSizeArea       = 600
LotSizeUnits      = 'SquareMeters'
LotSizeDimensions = '30m × 20m'
LotSizeSource     = 'Survey'

LivingArea                  = 380
LivingAreaUnits             = 'SquareMeters'
LivingAreaSource            = 'Builder'
AboveGradeFinishedArea      = 380
AboveGradeFinishedAreaUnits = 'SquareMeters'
BuildingAreaTotal           = 420
BuildingAreaUnits           = 'SquareMeters'
```

US-unit fields (`LotSizeAcres`, `LotSizeSquareFeet`) remain null on Nigerian records. Bank API consumers can compute US units client-side via simple multipliers if needed.

### 3.3 Nigerian Plot Size Conventions

Nigerian property is conventionally measured in:

| Unit | When Used | Conversion to sqm |
| --- | --- | --- |
| **Square meters (sqm / m²)** | Modern standard, especially residential | 1 sqm |
| **Plots** | Historical/colloquial. "Standard plot" in Lagos = typically 648 sqm (60ft × 120ft) but varies regionally; some plots are 450, 600, or 1,000+ sqm | Variable — never used as a storage unit |
| **Hectares (ha)** | Very large parcels (commercial land, agricultural) | × 10,000 |
| **Acres** | Some commercial and agricultural; foreign-buyer transactions | × 4,046.86 |
| **Square feet** | Rare; some legacy title documents | × 0.092903 |

**"Plots" is never used as a storage unit** — too variable. When a user enters "1 plot", the form must ask them to convert to sqm (typically 648 sqm for Lagos) or provide the actual sqm value from their survey. The UI surfaces this conversion explicitly.

### 3.4 Conversion Function

```sql
CREATE OR REPLACE FUNCTION compute_lot_size_sqm(area DECIMAL, units VARCHAR)
RETURNS DECIMAL AS $$
BEGIN
  RETURN CASE units
    WHEN 'SquareMeters' THEN area
    WHEN 'Hectares'     THEN area * 10000
    WHEN 'Acres'        THEN area * 4046.86
    WHEN 'SquareFeet'   THEN area * 0.092903
    ELSE NULL
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

Bank API responses include the normalized SquareMeters value alongside the source unit, so consumers don't need to convert.

---

## 4. Property Category × Area Field Matrix

The three MVP property categories populate area fields differently. This is the canonical rule set:

| Field | Land (Cat 1) | Residential House (Cat 2) | Apartment / Flat (Cat 3) |
| --- | --- | --- | --- |
| `LotSizeArea` | ✅ Required | ✅ Required | ❌ Null (unit owner doesn't own lot) |
| `LotSizeUnits` | ✅ Required | ✅ Required (SquareMeters) | ❌ Null |
| `LotSizeDimensions` | Optional | Optional | ❌ Null |
| `LotSizeSource` | ✅ Required | ✅ Required | ❌ Null |
| `LivingArea` | ❌ Null | ✅ Required | ✅ Required |
| `LivingAreaUnits` | ❌ Null | ✅ Required (SquareMeters) | ✅ Required (SquareMeters) |
| `LivingAreaSource` | ❌ Null | ✅ Required | ✅ Required |
| `AboveGradeFinishedArea` | ❌ Null | ✅ Required (mirrors LivingArea if no basement) | ✅ Required (mirrors LivingArea) |
| `AboveGradeFinishedAreaUnits` | ❌ Null | ✅ Required | ✅ Required |
| `BuildingAreaTotal` | ❌ Null | Optional (includes BQ, garage, terraces) | Optional |
| `BuildingAreaUnits` | ❌ Null | Required if BuildingAreaTotal populated | Required if BuildingAreaTotal populated |

### 4.1 The Apartment Case in Detail

For an apartment in a multi-unit building, the lot is owned by the building association, not the unit owner. RESO handles this by:

1. **Per-unit listing:** populate `LivingArea` only; leave `LotSizeArea` null.
2. **Whole-building listing (Phase 2 commercial):** populate `BuildingAreaTotal` for the entire structure footprint; `LotSizeArea` for the parcel the building sits on.

For MVP, only the per-unit case is supported.

---

## 5. The PostgreSQL Schema

### 5.1 Schema Patch

```sql
ALTER TABLE properties
  -- Lot size (land area)
  ADD COLUMN LotSizeArea                    DECIMAL(12, 2),
  ADD COLUMN LotSizeUnits                   VARCHAR(20),
  ADD COLUMN LotSizeDimensions              VARCHAR(100),
  ADD COLUMN LotSizeSource                  VARCHAR(30),
  
  -- Living area (building interior)
  ADD COLUMN LivingArea                     DECIMAL(10, 2),
  ADD COLUMN LivingAreaUnits                VARCHAR(20),
  ADD COLUMN LivingAreaSource               VARCHAR(30),
  
  -- Above-grade finished area (bank LOS standard)
  ADD COLUMN AboveGradeFinishedArea         DECIMAL(10, 2),
  ADD COLUMN AboveGradeFinishedAreaUnits    VARCHAR(20),
  
  -- Building total area (for whole-building or extension cases)
  ADD COLUMN BuildingAreaTotal              DECIMAL(10, 2),
  ADD COLUMN BuildingAreaUnits              VARCHAR(20);

-- If existing schema has LotSizeSquareMeters, deprecate it:
-- Keep it as a denormalised mirror for one release cycle, then drop.
```

### 5.2 Validation Constraints

```sql
ALTER TABLE properties
  -- Unit enums
  ADD CONSTRAINT chk_lot_size_units CHECK (
    LotSizeUnits IS NULL OR LotSizeUnits IN (
      'SquareMeters', 'Hectares', 'Acres', 'SquareFeet'
    )
  ),
  ADD CONSTRAINT chk_living_area_units CHECK (
    LivingAreaUnits IS NULL OR LivingAreaUnits IN ('SquareMeters', 'SquareFeet')
  ),
  ADD CONSTRAINT chk_above_grade_units CHECK (
    AboveGradeFinishedAreaUnits IS NULL OR 
    AboveGradeFinishedAreaUnits IN ('SquareMeters', 'SquareFeet')
  ),
  ADD CONSTRAINT chk_building_area_units CHECK (
    BuildingAreaUnits IS NULL OR BuildingAreaUnits IN ('SquareMeters', 'SquareFeet')
  ),
  
  -- Source enums
  ADD CONSTRAINT chk_lot_size_source CHECK (
    LotSizeSource IS NULL OR LotSizeSource IN (
      'Survey', 'Assessor', 'PublicRecords', 'Estimated', 'Owner', 'Builder', 'Other'
    )
  ),
  ADD CONSTRAINT chk_living_area_source CHECK (
    LivingAreaSource IS NULL OR LivingAreaSource IN (
      'Appraiser', 'Assessor', 'Builder', 'Owner', 'Plans', 'PublicRecords', 'Estimated', 'Other'
    )
  ),
  
  -- Positive values
  ADD CONSTRAINT chk_lot_size_positive CHECK (
    LotSizeArea IS NULL OR LotSizeArea > 0
  ),
  ADD CONSTRAINT chk_living_area_positive CHECK (
    LivingArea IS NULL OR LivingArea > 0
  ),
  ADD CONSTRAINT chk_above_grade_positive CHECK (
    AboveGradeFinishedArea IS NULL OR AboveGradeFinishedArea > 0
  ),
  ADD CONSTRAINT chk_building_area_positive CHECK (
    BuildingAreaTotal IS NULL OR BuildingAreaTotal > 0
  ),
  
  -- Unit consistency within record (no mixed Sq/sqft on same row)
  ADD CONSTRAINT chk_unit_consistency CHECK (
    (
      COALESCE(LivingAreaUnits, AboveGradeFinishedAreaUnits, BuildingAreaUnits) IS NULL
      OR (
        COALESCE(LivingAreaUnits, 'SquareMeters') = COALESCE(AboveGradeFinishedAreaUnits, 'SquareMeters')
        AND COALESCE(LivingAreaUnits, 'SquareMeters') = COALESCE(BuildingAreaUnits, 'SquareMeters')
      )
    )
  );
```

### 5.3 Computed Column for Normalized Sqm

For query convenience and bank API consumption, a virtual/materialized column expresses every record's lot size in sqm regardless of source unit:

```sql
-- Generated column (PostgreSQL 12+)
ALTER TABLE properties
  ADD COLUMN LotSizeSquareMeters DECIMAL(12, 2) GENERATED ALWAYS AS (
    CASE LotSizeUnits
      WHEN 'SquareMeters' THEN LotSizeArea
      WHEN 'Hectares'     THEN LotSizeArea * 10000
      WHEN 'Acres'        THEN LotSizeArea * 4046.86
      WHEN 'SquareFeet'   THEN LotSizeArea * 0.092903
      ELSE NULL
    END
  ) STORED;
```

Same pattern for `LivingAreaSquareMeters` if needed.

### 5.4 Indexes

```sql
-- For valuation comparable queries by lot size
CREATE INDEX idx_properties_lot_sqm     ON properties(LotSizeSquareMeters);
CREATE INDEX idx_properties_living_area ON properties(LivingArea);

-- Composite for typical bank query: "4-bedroom houses 500-700sqm in Lekki"
CREATE INDEX idx_properties_search_composite 
  ON properties(City, BedroomsTotal, LotSizeSquareMeters);
```

---

## 6. API Contract

### 6.1 Request — POST /api/v1/properties (4-bedroom Lekki duplex)

```json
{
  "PropertyType": "Residential",
  "PropertySubType": "SingleFamilyResidence",
  "Verity_NG_HouseStyle": "Duplex",
  
  "BedroomsTotal": 4,
  "BathroomsFull": 4,
  "BathroomsHalf": 2,
  
  "LotSizeArea": 600,
  "LotSizeUnits": "SquareMeters",
  "LotSizeDimensions": "30m × 20m",
  "LotSizeSource": "Survey",
  
  "LivingArea": 380,
  "LivingAreaUnits": "SquareMeters",
  "LivingAreaSource": "Builder",
  
  "AboveGradeFinishedArea": 380,
  "AboveGradeFinishedAreaUnits": "SquareMeters",
  
  "BuildingAreaTotal": 420,
  "BuildingAreaUnits": "SquareMeters"
}
```

### 6.2 Request — Studio apartment in Victoria Island

```json
{
  "PropertyType": "Residential",
  "PropertySubType": "Apartment",
  "Verity_NG_ApartmentStyle": "Studio",
  
  "LotSizeArea": null,
  "LotSizeUnits": null,
  
  "LivingArea": 45,
  "LivingAreaUnits": "SquareMeters",
  "LivingAreaSource": "Builder",
  
  "AboveGradeFinishedArea": 45,
  "AboveGradeFinishedAreaUnits": "SquareMeters"
}
```

### 6.3 Request — Vacant land in Ibeju-Lekki

```json
{
  "PropertyType": "Land",
  "PropertySubType": "VacantLand",
  "Verity_NG_LandZoning": "Residential",
  
  "LotSizeArea": 1,
  "LotSizeUnits": "Hectares",
  "LotSizeDimensions": "100m × 100m",
  "LotSizeSource": "Survey",
  
  "LivingArea": null,
  "AboveGradeFinishedArea": null
}
```

### 6.4 Response Includes Normalized Sqm

```json
{
  "ListingKey": "8f3e2a1c-...",
  "Verity_VPID": "VRT-7K2M9PXQR8",
  
  "LotSizeArea": 1,
  "LotSizeUnits": "Hectares",
  "LotSizeSquareMeters": 10000,
  "LotSizeDimensions": "100m × 100m",
  "LotSizeSource": "Survey"
}
```

The `LotSizeSquareMeters` field is auto-derived. Bank consumers can use either the source unit or the normalized value.

### 6.5 OData $filter Examples

```
# Properties with lot size between 500-700 sqm (normalized)
GET /api/v1/properties?$filter=LotSizeSquareMeters ge 500 
  and LotSizeSquareMeters le 700

# Apartments larger than 100 sqm living area
GET /api/v1/properties?$filter=PropertySubType eq 'Apartment' 
  and LivingArea gt 100

# Land parcels measured in hectares
GET /api/v1/properties?$filter=LotSizeUnits eq 'Hectares'

# Survey-verified lot sizes (highest confidence)
GET /api/v1/properties?$filter=LotSizeSource eq 'Survey'
```

---

## 7. TypeScript Types (Frontend)

```tsx
// src/types/area.ts

export type AreaUnit = 'SquareMeters' | 'SquareFeet' | 'Hectares' | 'Acres';

export type LotSizeSource = 
  | 'Survey' | 'Assessor' | 'PublicRecords' 
  | 'Estimated' | 'Owner' | 'Builder' | 'Other';

export type LivingAreaSource = 
  | 'Appraiser' | 'Assessor' | 'Builder' | 'Owner' 
  | 'Plans' | 'PublicRecords' | 'Estimated' | 'Other';

export interface AreaFields {
  // Lot size (land)
  LotSizeArea: number | null;
  LotSizeUnits: AreaUnit | null;
  LotSizeDimensions: string | null;
  LotSizeSource: LotSizeSource | null;
  LotSizeSquareMeters: number | null;  // derived, read-only
  
  // Living area (building interior)
  LivingArea: number | null;
  LivingAreaUnits: AreaUnit | null;
  LivingAreaSource: LivingAreaSource | null;
  
  // Above-grade finished area (bank LOS)
  AboveGradeFinishedArea: number | null;
  AboveGradeFinishedAreaUnits: AreaUnit | null;
  
  // Building total
  BuildingAreaTotal: number | null;
  BuildingAreaUnits: AreaUnit | null;
}

// Conversion factors
export const SQM_PER_UNIT: Record<AreaUnit, number> = {
  SquareMeters: 1,
  SquareFeet: 0.092903,
  Hectares: 10000,
  Acres: 4046.86,
};

export function toSquareMeters(area: number, units: AreaUnit): number {
  return area * SQM_PER_UNIT[units];
}

// Display formatter
export function formatArea(area: number | null, units: AreaUnit | null): string {
  if (area == null || units == null) return '—';
  
  const unitLabel = {
    SquareMeters: 'sqm',
    SquareFeet: 'sqft',
    Hectares: 'ha',
    Acres: 'acres',
  }[units];
  
  return `${area.toLocaleString()} ${unitLabel}`;
}

// Plot conversion helper (Lagos default)
export const LAGOS_STANDARD_PLOT_SQM = 648;

export function plotsToSquareMeters(plots: number): number {
  return plots * LAGOS_STANDARD_PLOT_SQM;
}
```

### 7.1 Zod Validation Schema

```tsx
import { z } from 'zod';

const areaUnitSchema = z.enum(['SquareMeters', 'SquareFeet', 'Hectares', 'Acres']);

export const areaFieldsSchema = z.object({
  // Lot size (required for Land and Residential House)
  LotSizeArea: z.number().positive().optional(),
  LotSizeUnits: areaUnitSchema.optional(),
  LotSizeDimensions: z.string().max(100).optional(),
  LotSizeSource: z.enum([
    'Survey', 'Assessor', 'PublicRecords', 
    'Estimated', 'Owner', 'Builder', 'Other'
  ]).optional(),
  
  // Living area (required for House and Apartment)
  LivingArea: z.number().positive().optional(),
  LivingAreaUnits: areaUnitSchema.optional(),
  LivingAreaSource: z.enum([
    'Appraiser', 'Assessor', 'Builder', 'Owner', 
    'Plans', 'PublicRecords', 'Estimated', 'Other'
  ]).optional(),
  
  AboveGradeFinishedArea: z.number().positive().optional(),
  AboveGradeFinishedAreaUnits: areaUnitSchema.optional(),
  
  BuildingAreaTotal: z.number().positive().optional(),
  BuildingAreaUnits: areaUnitSchema.optional(),
}).refine(
  (data) => {
    // If LotSizeArea provided, LotSizeUnits must be provided
    if (data.LotSizeArea != null && data.LotSizeUnits == null) return false;
    if (data.LivingArea != null && data.LivingAreaUnits == null) return false;
    return true;
  },
  { message: 'Area values must include their unit' }
);
```

---

## 8. UI Implementation — Property Specifications Step

Area capture lives in the same Property Specifications step as bathroom counts. The form renders different fields depending on the property category selected in Step 1.

### 8.1 Conditional Field Rendering

```
┌─────────────────────────────────────────────────────────┐
│  PROPERTY SPECIFICATIONS                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [ Rooms & Bathrooms section — per Bathroom spec ]      │
│                                                         │
│  ─────────────────────────────────────                  │
│                                                         │
│  Area                                                   │
│                                                         │
│  IF CATEGORY = LAND:                                    │
│    Lot size:        [  600 ] [ SquareMeters ▼ ]        │
│    Dimensions:      [ 30m × 20m              ]          │
│    Source:          [ Survey               ▼ ]          │
│                                                         │
│  IF CATEGORY = RESIDENTIAL HOUSE:                       │
│    Lot size:        [  600 ] [ SquareMeters ▼ ]        │
│    Dimensions:      [ 30m × 20m              ]          │
│    Lot source:      [ Survey               ▼ ]          │
│                                                         │
│    Living area:     [  380 ] sqm                        │
│    Living source:   [ Builder              ▼ ]          │
│                                                         │
│    Building total:  [  420 ] sqm   (optional)           │
│      Includes BQ, garage, terraces                      │
│                                                         │
│  IF CATEGORY = APARTMENT / FLAT:                        │
│    Living area:     [   45 ] sqm                        │
│    Living source:   [ Builder              ▼ ]          │
│                                                         │
│    ℹ️ Lot size is not applicable to apartments —        │
│       the building association owns the land            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 8.2 The Plot Conversion Helper

When the user enters a value the form interprets as "plots" (free-text "1 plot" or similar in the Lot Size input), surface an inline conversion:

```
💡 1 standard Lagos plot ≈ 648 sqm. 
   Use 648 if your survey doesn't specify, or enter your 
   survey's exact value.
```

### 8.3 Unit Selector Behaviour

- **Land:** unit dropdown shows `SquareMeters`, `Hectares`, `Acres` (SquareFeet hidden — uncommon in Lagos).
- **House/Apartment Living Area:** unit dropdown shows `SquareMeters` only (residential standard). No selector needed — implicit.
- **Building Total:** same as Living Area — sqm only.

### 8.4 Live Computed Display

As the user enters values, a sidebar shows the normalized sqm equivalent for any non-sqm unit:

```
You entered: 1 Hectare
            ↓
Normalized: 10,000 sqm
```

This is purely informational, helping the user verify they've selected the correct unit.

### 8.5 Source Selector — Tooltips

Each source value has a tooltip explaining what it means:

| Source | Tooltip |
| --- | --- |
| Survey | A formal survey by a licensed surveyor; highest confidence |
| Assessor | Government assessor's recorded value |
| PublicRecords | From C of O, Deed of Assignment, or similar registered document |
| Builder | Stated by the original developer/builder |
| Owner | Stated by the current owner (lower confidence) |
| Estimated | Best estimate; no formal documentation |
| Other | Source not in the above list |

---

## 9. Verification Report PDF — Area Display

### 9.1 Page 3 — Property Information (Area Section)

A new Area section sits between Rooms & Fixtures and Title Information on Page 3:

```
┌─────────────────────────────────────────────────────────┐
│  AREA                                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Lot Size                                               │
│    LotSizeArea           600                            │
│    LotSizeUnits          SquareMeters                   │
│    LotSizeDimensions     30m × 20m                      │
│    LotSizeSource         Survey-verified                │
│                                                         │
│  Living Area                                            │
│    LivingArea            380 sqm                        │
│    LivingAreaSource      Builder-stated                 │
│                                                         │
│  Above-Grade Finished                                   │
│    AboveGradeFinished    380 sqm                        │
│                                                         │
│  Building Total                                         │
│    BuildingAreaTotal     420 sqm                        │
│      (includes BQ, garage, terraces)                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

For Land records, only the Lot Size sub-section renders. For Apartments, only Living Area + Above-Grade.

### 9.2 Cover Page Display

The cover page surfaces lot size as a property card field:

```
Plot Size:    600 sqm  (Survey-verified)
```

For apartments, this replaces with:

```
Unit Size:    45 sqm  (Builder-stated)
```

---

## 10. OCR Pipeline — Where Area Data Comes From

### 10.1 What OCR Can Extract

| Field | Source documents | Extraction confidence target |
| --- | --- | --- |
| `LotSizeArea`  • `LotSizeUnits` | Survey Plan, C of O | ≥ 90% |
| `LotSizeDimensions` | Survey Plan | ≥ 85% |
| `LotSizeSource` | Auto-set to `Survey` if from survey plan, `PublicRecords` if from C of O | 100% (rule-based) |
| `LivingArea` | Building Plan, Approval Documents | ≥ 80% |
| `BuildingAreaTotal` | Building Plan | ≥ 80% |

Key insight: **Survey Plans are the gold-standard source for lot size.** When a Survey Plan is uploaded, the OCR-extracted lot size overrides user-entered values (with analyst confirmation), and `LotSizeSource` is set to `Survey`.

### 10.2 Reconciliation Logic

When OCR-extracted area conflicts with user self-report:

1. **Lot size conflict > 10%:** Analyst flag. Survey Plan is authoritative.
2. **Lot size conflict ≤ 10%:** Soft flag. Likely measurement precision; analyst confirms.
3. **Living area conflict:** Soft flag. Building plans and as-built measurements often differ.
4. **Unit mismatch (e.g. user said sqm, document said sqft):** Critical flag. Manual review required.

### 10.3 Confidence Scoring Impact

Area fields are **Silver-tier signals** in the confidence scoring system:

- Survey-sourced lot size: contributes +5 to confidence score (out of 100)
- C of O-sourced lot size: contributes +3
- Owner-stated only: contributes 0 (no boost, no penalty)
- Unit mismatch or missing units: −5 penalty (data quality issue)

---

## 11. MVP Implementation Surfaces

| Surface | Owner | Change Required |
| --- | --- | --- |
| PostgreSQL schema | CTO + Sr. Engineer #1 | Add 11 area columns; add 9 constraints; add generated LotSizeSquareMeters; add 3 indexes |
| Conversion function | Sr. Engineer #1 | `compute_lot_size_sqm()` PL/pgSQL function |
| FastAPI endpoint validation | Sr. Engineer #1 | Accept area fields in POST/PATCH; enforce category × field matrix (Land requires LotSize; Apartment forbids LotSize; etc.) |
| OData filter parser | Sr. Engineer #1 | Whitelist all area fields including LotSizeSquareMeters for `$filter` queries |
| Bank API response builder | Sr. Engineer #1 | Always include normalized SquareMeters alongside source-unit values |
| TypeScript types | Boniface | Add `AreaFields` interface; conversion helpers; Zod validation; display formatters |
| Upload Property flow | Boniface + Adebayo | Conditional area fields based on selected category; unit selector for Land; plot conversion helper inline tip; live sqm preview |
| Property Detail page | Boniface + Adebayo | Display area fields with RESO tags; show normalized sqm alongside source units for Hectares/Acres |
| Verification Report PDF | CTO (WeasyPrint) + Adebayo | New Area section on Page 3; lot size on cover page; conditional rendering per property category |
| Public verify endpoint | CTO | Return `LotSizeSquareMeters`, `LivingArea`, `LotSizeUnits`, `LivingAreaUnits` (low-sensitivity descriptive fields that help trust) |
| OCR pipeline — area extractor | Data Engineer / ML | Custom Python extractor for Survey Plan dimensions, C of O lot statements, Building Plan living area |
| OCR reconciliation logic | Data Engineer / ML + CTO | Analyst flag rules for area conflicts > 10%, unit mismatches, source escalation |
| Confidence scoring update | CTO | +5/+3/0/−5 weights for Survey/PublicRecords/Owner/Mismatch |
| Analyst QA queue UI | CTO + Adebayo | Show user-entered vs OCR-extracted area side-by-side; analyst can override |
| Bank API documentation | CTO | Document the normalized SquareMeters convention; note that Hectares/Acres source units are preserved alongside |
| Test data fixtures | Sr. Engineer #1 | Generate Land, House, Apartment fixtures with realistic Nigerian area values |

---

## 12. Edge Cases & Conventions

### 12.1 "Plot" as User Input

If the user enters a value with "plot" in free-text (e.g. "1 plot", "half a plot"), the form does NOT accept "plot" as a unit. Instead, it surfaces the conversion helper:

> 1 standard Lagos plot ≈ 648 sqm. Enter the sqm value from your survey, or use 648 if not specified.
> 

### 12.2 Living Area Larger Than Lot Size

For multi-storey buildings, `LivingArea` can exceed `LotSizeArea` (a 600 sqm plot can have a 1,200 sqm 4-storey building). This is valid and not flagged.

### 12.3 Living Area Much Smaller Than Lot Size

A 600 sqm plot with a 100 sqm living area means most of the parcel is undeveloped (garden, parking, BQ extension). This is valid; not flagged.

### 12.4 Apartment with LotSize Provided

If a user enters a LotSize for an Apartment listing, the form raises an inline warning:

> Apartments typically don't have an individual lot size — the building association owns the land. Do you mean to record the building's footprint?
> 

The value is accepted (defensive) but the analyst QA queue flags it for review.

### 12.5 BuildingAreaTotal Less Than LivingArea

This would be impossible (the total can't be less than the habitable subset). Validation rejects it.

### 12.6 Hectares for Small Parcels

If a user enters `LotSizeArea = 0.05 LotSizeUnits = Hectares` (i.e. 500 sqm), the form accepts it but suggests:

> 500 sqm. Did you mean to enter this in SquareMeters instead?
> 

Most Lagos residential parcels are < 0.1 hectare and reading more naturally in sqm.

### 12.7 Updates After Upload

When an area value is corrected (analyst override, user edit), the previous values are retained in `vpid_lineage` — existing VPID architecture handles this. Bank API responses include the most recent value; the audit trail is queryable separately.

---

## 13. Bank API Implications

### 13.1 Why Area Matters for the Year 5 Bank API

Banks use area data for three critical purposes:

1. **Price-per-sqm valuation comparables.** `PricePerSqm = ListPrice / LotSizeSquareMeters` (for houses) or `/ LivingArea` (for apartments). This is the single most important valuation metric after location.
2. **LTV calculation refinement.** Some banks weight LTV by property size — larger properties get slightly lower LTV thresholds due to liquidity concerns.
3. **Portfolio concentration analysis.** Total sqm exposure by LGA and city for risk reporting.

Without standardized area data, banks fall back to per-property manual valuation (slow, expensive). VERITY's normalized sqm convention is what makes the API consumable at scale.

### 13.2 The Source Provenance Layer

Banks weight comparables by source quality. A Survey-sourced lot size carries materially more weight than Owner-stated. The `LotSizeSource` enum maps directly to standard appraisal practice:

| Source | Bank confidence weight |
| --- | --- |
| Survey | 1.0 (full weight) |
| PublicRecords / Assessor | 0.9 |
| Builder / Plans | 0.8 |
| Estimated | 0.5 |
| Owner | 0.3 |

VERITY surfaces this in the bank API response so banks can weight comparables in their LOS systems automatically.

### 13.3 The Documentation Disclosure

The bank API documentation explicitly states:

- All `LotSizeArea` values are accompanied by `LotSizeUnits` AND a computed `LotSizeSquareMeters` for normalized queries.
- `LotSizeSource` reflects provenance; consumers should weight comparables accordingly.
- Apartments do not populate `LotSizeArea`; use `LivingArea` for valuation.
- All units within a property record are consistent (no mixed sqm/sqft).

---

## 14. Schema Patch Migration Plan

Green-field migration (no properties uploaded yet):

```sql
-- Migration: 2026_04_29_add_reso_area_fields.sql

BEGIN;

-- Stage 1: Add columns
ALTER TABLE properties
  ADD COLUMN LotSizeArea                    DECIMAL(12, 2),
  ADD COLUMN LotSizeUnits                   VARCHAR(20),
  ADD COLUMN LotSizeDimensions              VARCHAR(100),
  ADD COLUMN LotSizeSource                  VARCHAR(30),
  ADD COLUMN LivingArea                     DECIMAL(10, 2),
  ADD COLUMN LivingAreaUnits                VARCHAR(20),
  ADD COLUMN LivingAreaSource               VARCHAR(30),
  ADD COLUMN AboveGradeFinishedArea         DECIMAL(10, 2),
  ADD COLUMN AboveGradeFinishedAreaUnits    VARCHAR(20),
  ADD COLUMN BuildingAreaTotal              DECIMAL(10, 2),
  ADD COLUMN BuildingAreaUnits              VARCHAR(20);

-- Stage 2: Generated column for normalized sqm
ALTER TABLE properties
  ADD COLUMN LotSizeSquareMeters DECIMAL(12, 2) GENERATED ALWAYS AS (
    CASE LotSizeUnits
      WHEN 'SquareMeters' THEN LotSizeArea
      WHEN 'Hectares'     THEN LotSizeArea * 10000
      WHEN 'Acres'        THEN LotSizeArea * 4046.86
      WHEN 'SquareFeet'   THEN LotSizeArea * 0.092903
      ELSE NULL
    END
  ) STORED;

-- Stage 3: Constraints
ALTER TABLE properties
  ADD CONSTRAINT chk_lot_size_units CHECK (
    LotSizeUnits IS NULL OR LotSizeUnits IN ('SquareMeters', 'Hectares', 'Acres', 'SquareFeet')
  ),
  ADD CONSTRAINT chk_living_area_units CHECK (
    LivingAreaUnits IS NULL OR LivingAreaUnits IN ('SquareMeters', 'SquareFeet')
  ),
  ADD CONSTRAINT chk_lot_size_source CHECK (
    LotSizeSource IS NULL OR LotSizeSource IN (
      'Survey', 'Assessor', 'PublicRecords', 'Estimated', 'Owner', 'Builder', 'Other'
    )
  ),
  ADD CONSTRAINT chk_living_area_source CHECK (
    LivingAreaSource IS NULL OR LivingAreaSource IN (
      'Appraiser', 'Assessor', 'Builder', 'Owner', 'Plans', 'PublicRecords', 'Estimated', 'Other'
    )
  ),
  ADD CONSTRAINT chk_lot_size_positive CHECK (LotSizeArea IS NULL OR LotSizeArea > 0),
  ADD CONSTRAINT chk_living_area_positive CHECK (LivingArea IS NULL OR LivingArea > 0);

-- Stage 4: Indexes
CREATE INDEX idx_properties_lot_sqm ON properties(LotSizeSquareMeters);
CREATE INDEX idx_properties_living_area ON properties(LivingArea);
CREATE INDEX idx_properties_search_composite 
  ON properties(City, BedroomsTotal, LotSizeSquareMeters);

COMMIT;
```

Rollback: pure DROP of all added columns. No legacy data to preserve.

---

## 15. Definition of Done

The area implementation is complete when ALL of the following are verifiably true:

1. **PostgreSQL schema** contains all 11 area columns + the generated `LotSizeSquareMeters` column.
2. **All constraints active**: unit enums, source enums, positive-value checks.
3. **Generated column computes correctly** for all 4 supported units (sqm passes through; hectares ×10,000; acres ×4046.86; sqft ×0.092903).
4. **API endpoint** accepts area fields and rejects category × field violations (e.g. Apartment with LotSizeArea triggers warning but is accepted).
5. **API responses** always include `LotSizeSquareMeters` when `LotSizeArea` + `LotSizeUnits` are present.
6. **OData `$filter`** works on all area fields including the normalized sqm field.
7. **TypeScript types** include `AreaFields`, all enums, conversion functions, formatters, Zod schema.
8. **Upload Property flow** renders different area fields per category (Land vs House vs Apartment); plot conversion helper appears on free-text "plot" input; live sqm preview for non-sqm units.
9. **Property Detail page** shows area fields with RESO tags; normalized sqm displayed alongside source units.
10. **Verification Report PDF** Page 3 has the new Area section; cover page shows category-appropriate area summary.
11. **OCR pipeline** extracts area from Survey Plans, C of Os, Building Plans with documented confidence thresholds.
12. **Confidence scoring** applies the Silver-tier weights (Survey +5, PublicRecords +3, Owner 0, Mismatch −5).
13. **Test coverage** includes:
    - Unit tests for `toSquareMeters()` covering all 4 units
    - Integration tests for the generated column with all 4 unit types
    - E2E tests for the category-conditional form rendering
    - OCR extraction tests on at least 10 sample Survey Plans

---

## 16. Phase 2 / Future Roadmap

Deferred items:

| Field / Feature | Phase | Reason for Deferral |
| --- | --- | --- |
| `BelowGradeFinishedArea` | Phase 2 | Basements are very rare in Lagos; revisit if Abuja market grows |
| `LotSizeAcres` (US convenience field) | Phase 2 | Banks can compute client-side from sqm |
| `LotSizeSquareFeet` (US convenience field) | Phase 2 | Same as Acres |
| Multi-unit building total area | Phase 2 | Commercial property type |
| Density metrics (Floor-Area Ratio, Plot Coverage Ratio) | Series A | Useful for valuation refinement; not needed in MVP |
| Land use ratio analysis | Series A | Garden vs. built-up split |
| Above-grade vs below-grade breakdown | Series A | Bank LOS comparables become more sophisticated |
| Photo-derived area estimation | Phase 3 | ML-based square footage estimation from satellite imagery |
| Cadastral survey integration | Phase 3 | When Lagos State Lands Bureau API is available, pull lot dimensions directly |

---

*v1.0 — April 2026 — Initial standalone area & measurement implementation standard. Sourced from RESO Adoption Brief v1.1, Tech Stack v1.1, CTO Reference v1.1, Designer Reference v1.1, RESO Bathroom Implementation v1.1, Address Capture v1.*