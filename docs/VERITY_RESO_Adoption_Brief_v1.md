# VERITY — RESO Adoption Brief

| | |
|---|---|
| **Version** | 1.1 — April 2026 |
| **Status** | Internal — Engineering, Product & Design Reference |
| **Scope** | RESO Data Dictionary v2.0 adoption — decision, scope, property type mapping, MVP implementation surfaces |
| **Owner** | Ladi Awolaja — CPO |
| **Source documents** | Tech Stack v1.1 (§2.2, §2.3, §10), CTO Reference — Ruro v1.1 (§3, §8), Frontend Reference — Boniface v1.1 (§3, §6), Designer Reference — Adebayo v1.1 (§3, §5), MVP PRD v1.1, RESO Property Type Mapping — Nigeria v1, Full Business Plan v1.1 (§7, §15), RESO Bathroom Implementation v1.1 |
| **Changelog** | v1.1: Added `Verity_NG_BQBedroomsTotal` to the BQ extension field set in §4 schema and §7 field register. Cross-reference to Bathroom Implementation v1.1 updated. |

*STRICTLY CONFIDENTIAL — INTERNAL DOCUMENT*

---

## 1. The Strategic Conclusion

> **VERITY adopts RESO Data Dictionary v2.0 from MVP — not as a Phase 2 migration.** This is the single most important technical-strategic decision in the platform, and it directly enables the Year 5 ₦8.0B+ bank mortgage API revenue stream. VERITY is the only Nigerian property platform to have adopted RESO standards.

The decision was final at the start of the seed phase and is now propagated across every layer of the documentation set, the codebase, and the design system. RESO compliance is not a feature — it is the schema reality of every property record VERITY will ever create.

---

## 2. Why RESO Was Non-Negotiable

Three reinforcing arguments locked the decision:

### 2.1 The bank API depends on it

Nigerian commercial bank Loan Origination Systems consume RESO-formatted data. If VERITY launched with a custom schema and tried to add RESO later, every property record added between MVP and that migration would become technical debt that has to be re-mapped.

- At 5,000 records (Month 18) the migration is painful but possible
- At 50,000+ records (Year 3) it becomes a multi-month engineering project at exactly the moment Series A capital should be funding growth

The Year 5 bank mortgage API revenue stream — ₦8.0B+, the largest single institutional line — depends on VERITY's data being directly consumable by bank loan origination systems without translation. Adopting RESO from MVP eliminates this migration debt entirely.

### 2.2 Institutional credibility on day one

When banks conduct due diligence on the VERITY API pilot, "we use the global real estate data standard" is a materially stronger answer than "we built our own schema." It signals that VERITY is being built for institutional consumption — not as another startup that will eventually need to grow up.

This positions VERITY as infrastructure, not application — the same architectural posture that CoreLogic took in the US property market.

### 2.3 No Nigerian competitor has done this

This is a structural advantage VERITY can lock in cheaply at MVP and one that compounds. A later entrant adopting RESO inherits years of migration debt that VERITY does not have. This is documented as one of VERITY's five stacked competitive moats:

1. LASRERA Regulatory Moat
2. Property Data Graph Moat (VPID)
3. **RESO Standards Moat ← this one**
4. OCR Capability Moat
5. Two-Sided Liquidity Moat

---

## 3. What "RESO Adoption" Specifically Means

This is not aspirational — every layer of the stack reflects it:

| Layer | RESO Reality |
|---|---|
| **PostgreSQL schema** | All property table columns use RESO PascalCase field names (`PropertyType`, `PropertySubType`, `CountyOrParish`, `UnparsedAddress`, `StandardStatus`, `ListingKey` as primary key) |
| **Custom namespace** | Nigeria-specific vocabulary lives in `Verity_NG_*` fields — universal standard stays universal; custom additions explicitly namespaced |
| **API transport** | RESO Web API (OData 4.0) as the standard format for institutional consumers |
| **Property Identifier** | VPID (`VRT-XXXXXXXXX`) stored as `Verity_VPID` column |
| **UPI format** | `NG-LA-{LGA}-{TitleType}:{TitleRef}` for Nigerian Universal Property Identifier |
| **Geography mapping** | Nigerian LGAs map to RESO's `CountyOrParish`; states map to `StateOrProvince` with `StateOrProvince = "Lagos"` default for Phase 1 |
| **Frontend TypeScript** | All interfaces use RESO field names; `Verity_NG_*` types are explicitly typed (`VerityNG_HouseStyle`, etc.) |
| **Filter syntax** | OData `$filter` used in API queries (e.g. `PropertyType eq 'Residential' and Verity_NG_HouseStyle eq 'Duplex'`) |
| **Verification Report PDF** | Every field on the report is RESO-tagged with the field name visible in a tag pill |

---

## 4. The PostgreSQL Schema (Canonical)

```sql
CREATE TABLE properties (
    ListingKey              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Verity_VPID             VARCHAR(12) UNIQUE,
    PropertyType            VARCHAR(50) NOT NULL,
    PropertySubType         VARCHAR(50),
    StandardStatus          VARCHAR(30) DEFAULT 'Incomplete',
    UnparsedAddress         VARCHAR(500) NOT NULL,
    CountyOrParish          VARCHAR(100) NOT NULL,
    StateOrProvince         VARCHAR(50) NOT NULL DEFAULT 'Lagos',
    Country                 VARCHAR(2) NOT NULL DEFAULT 'NG',
    PostalCode              VARCHAR(10),
    Latitude                DECIMAL(10, 7),
    Longitude               DECIMAL(10, 7),
    BedroomsTotal           SMALLINT,
    BathroomsFull           SMALLINT,
    BathroomsHalf           SMALLINT,
    BathroomsTotalInteger   SMALLINT,
    BathroomsTotalDecimal   DECIMAL(3, 1),
    LotSizeSquareMeters     INTEGER,
    YearBuilt               SMALLINT,

    -- Verity Nigeria-specific custom fields (Verity_NG_* namespace)
    Verity_NG_HouseStyle      VARCHAR(20),
    Verity_NG_HouseAttachment VARCHAR(20),
    Verity_NG_ApartmentStyle  VARCHAR(20),
    Verity_NG_LandZoning      VARCHAR(20),
    Verity_NG_LandFeature     VARCHAR(20) DEFAULT 'None',
    Verity_NG_HasBQ           BOOLEAN DEFAULT FALSE,
    Verity_NG_BQConfig        VARCHAR(20),
    Verity_NG_BQSeparateTitle BOOLEAN DEFAULT FALSE,
    Verity_NG_BQBedroomsTotal SMALLINT DEFAULT 0,
    Verity_NG_BQBathroomsFull SMALLINT DEFAULT 0,
    Verity_NG_BQBathroomsHalf SMALLINT DEFAULT 0,

    -- Verity title fields (Verity_* namespace)
    Verity_TitleType        VARCHAR(50),
    Verity_CofONumber       VARCHAR(100),
    Verity_RegisteredOwner  VARCHAR(255),
    Verity_TitleIssueDate   DATE,
    Verity_TitleDuration    VARCHAR(50),
    Verity_SurveyPlanRef    VARCHAR(100),
    Verity_LGA              VARCHAR(100),
    Verity_ConfidenceScore  SMALLINT DEFAULT 0,

    -- Constraints: enforce correct Nigerian RESO mapping
    CONSTRAINT chk_no_reso_duplex     CHECK (PropertySubType != 'Duplex'),
    CONSTRAINT chk_no_condominium     CHECK (PropertySubType != 'Condominium')
);
```

---

## 5. The Five-Category UI → RESO Mapping (FINAL)

This is the canonical mapping used across the developer dashboard, the marketplace, the verification report, and the bank API.

| UI Category | `PropertyType` | `PropertySubType` derivation | Key `Verity_NG_*` fields | MVP? |
|---|---|---|---|---|
| Landed Property | `Land` | `VacantLand` (Residential/MixedUse) · `CommercialLand` (Commercial/Industrial) · `AgriculturalLand` | `Verity_NG_LandZoning`, `Verity_NG_LandFeature` | ✅ Yes |
| Residential House | `Residential` | Bungalow/Duplex + any attachment → `SingleFamilyResidence`; Terrace + any → `Townhouse` | `Verity_NG_HouseStyle`, `Verity_NG_HouseAttachment` | ✅ Yes |
| Apartment / Flat | `Residential` | Always `Apartment` — `Verity_NG_ApartmentStyle` carries distinction | `Verity_NG_ApartmentStyle` | ✅ Yes |
| Commercial | `Commercial` | Phase 2 | Phase 2 | ❌ Phase 2 |
| Farm | `Farm` | Phase 2 | Phase 2 | ❌ Phase 2 |

### 5.1 Landed Property — Sub-Categories

When user selects Landed Property, secondary selector offers 5 sub-categories that determine `PropertySubType` and `Verity_NG_LandZoning`:

| Sub-Category UI | `PropertySubType` | `Verity_NG_LandZoning` |
|---|---|---|
| Residential Plot | `VacantLand` | `Residential` |
| Commercial Plot | `CommercialLand` | `Commercial` |
| Mixed-Use Plot | `VacantLand` | `MixedUse` |
| Industrial Plot | `CommercialLand` | `Industrial` |
| Agricultural Plot | `AgriculturalLand` | `Agricultural` |

Plus optional **Waterfront / Reclaimed** attribute toggles → `Verity_NG_LandFeature`. Values: `Waterfront`, `Reclaimed`, `None` (default).

### 5.2 Residential House — Style + Attachment

When user selects Residential House, two secondary selectors are shown:

**Verity_NG_HouseStyle:** `Bungalow` | `Duplex` | `Terrace`
**Verity_NG_HouseAttachment:** `Detached` | `SemiDetached`

The combination determines `PropertySubType` (rule enforced at API):

| `Verity_NG_HouseStyle` + Attachment | `PropertySubType` |
|---|---|
| Bungalow + Detached or SemiDetached | `SingleFamilyResidence` |
| Duplex + Detached or SemiDetached | `SingleFamilyResidence` |
| Terrace + Detached or SemiDetached | `Townhouse` |

### 5.3 Apartment / Flat — Style Only

When user selects Apartment / Flat, one secondary selector is shown:

**Verity_NG_ApartmentStyle (exactly 4 values):**

| UI Card | `Verity_NG_ApartmentStyle` | Tooltip (Nigerian colloquial) |
|---|---|---|
| Studio | `Studio` | "Self-Contain" |
| Standard Flat | `StandardFlat` | 1-bed: "Mini-Flat" |
| Penthouse | `Penthouse` | — |
| Maisonette | `Maisonette` | — |

**`PropertySubType = Apartment` always** — regardless of style. MiniFlat and Self-Contain are tooltip labels for buyer familiarity only — they are NOT separate `Verity_NG_ApartmentStyle` values.

### 5.4 Boys' Quarters Toggle (Categories 2 & 3 only)

For Residential House and Apartment / Flat, a toggle is shown: "This property includes a Boys' Quarters"

If toggle is ON:
- `Verity_NG_HasBQ = TRUE`
- Secondary selector for `Verity_NG_BQConfig`: `Attached` | `Detached` | `Rooftop`
- Checkbox: "BQ has separate C of O" → `Verity_NG_BQSeparateTitle = TRUE`

> **Critical rule:** If `Verity_NG_BQSeparateTitle = TRUE`, the OCR pipeline raises an analyst flag with an amber notice on the property detail page: *"This property's BQ may have a separate title. Additional verification underway."* The BQ title document must be uploaded and verified independently.

---

## 6. Property Types EXCLUDED from Nigerian Context

These are RESO-standard `PropertySubType` values that VERITY does NOT use for any Nigerian record, and the constraints/rules enforcing the exclusion.

### 6.1 `PropertySubType = 'Duplex'` — BLOCKED at DB constraint level

**Why excluded:** RESO's `Duplex` definition means a *two-unit income property* — two separate dwelling units sharing a wall, typically with two front doors, often rented to two separate tenants. This is a North American multifamily concept.

**Nigerian usage problem:** In Nigeria, "duplex" colloquially means a two-storey single-family home (one family, one entrance, multiple floors). This is the opposite of the RESO meaning — single-family, not multi-family.

**Resolution:** Nigerian duplex = `PropertySubType = SingleFamilyResidence` + `Verity_NG_HouseStyle = Duplex`. The colloquial name lives in the custom namespace; the RESO field correctly reflects single-family ownership.

**Enforcement:** Database constraint `chk_no_reso_duplex CHECK (PropertySubType != 'Duplex')` at the schema level. Any attempt to insert a record with `PropertySubType = 'Duplex'` will fail at the database. This is intentional. Getting this wrong would mean the bank API delivers semantically wrong data to lenders — a Nigerian duplex would be classified as a two-unit income property and flagged for completely different underwriting treatment.

### 6.2 `PropertySubType = 'Condominium'` — BLOCKED at DB constraint level

**Why excluded:** RESO's `Condominium` definition presumes condominium law — unit-level title ownership with shared common areas governed by an HOA or condominium corporation. This legal structure does not exist in Nigerian property law.

**Nigerian reality:** Apartment buildings in Nigeria are typically owned at the building level (one C of O) or as separately-titled units (each with its own C of O), but neither is a condominium in the legal sense. There is no Nigerian equivalent of the condominium legal structure.

**Resolution:** Use `PropertySubType = Apartment` for all apartment/flat units, with `Verity_NG_ApartmentStyle` carrying the building-type distinction.

**Enforcement:** Database constraint `chk_no_condominium CHECK (PropertySubType != 'Condominium')`. Schema-level block.

### 6.3 `PropertySubType = 'ResidentialIncome'` — EXCLUDED (no constraint, by convention)

**Why excluded:** RESO's `ResidentialIncome` describes a single owner holding multiple residential units rented as a single investment portfolio (e.g. a 4-unit apartment building owned by one investor, rented to 4 tenants). This pattern exists in Nigeria but ownership is fragmented at the unit level in practice — each unit typically has its own title document, and Nigerian buyers/sellers transact at the unit level, not the building level.

**Resolution:** Each individual unit is recorded as `PropertyType = Residential, PropertySubType = Apartment`. The building-level ownership is not modelled at the RESO level — if a single investor owns multiple units in a building, each unit is a separate VERITY property record with its own VPID.

**Enforcement:** Not constraint-enforced (might be needed in Phase 2 for institutional investor scenarios). For MVP, the UI does not surface `ResidentialIncome` as a category option.

### 6.4 Other RESO Types — Out of Scope for MVP

| RESO Type | MVP Status | Reasoning |
|---|---|---|
| `Commercial` (full type) | Phase 2 | Different verification workflows (commercial lease structures, anchor tenant analysis); separate product surface |
| `Farm` | Phase 2 | Agricultural land verification has rural registry complexities outside Lagos focus |
| `BusinessOpportunity` | Out of scope | Not a property type in VERITY's sense |
| `ManufacturedInPark` / `MobileHome` | Out of scope | Not relevant to Nigerian market |

### 6.5 Quick Reference — What VERITY Uses and Doesn't

| `PropertySubType` | MVP Status | Notes |
|---|---|---|
| `SingleFamilyResidence` | ✅ Used | Maps to Bungalow + Duplex (Nigerian sense) |
| `Townhouse` | ✅ Used | Maps to Terrace |
| `Apartment` | ✅ Used | All Apartment/Flat styles |
| `VacantLand` | ✅ Used | Residential + MixedUse plots |
| `CommercialLand` | ✅ Used | Commercial + Industrial plots |
| `AgriculturalLand` | ✅ Used | Agricultural plots |
| `Duplex` | ❌ **BLOCKED** | DB constraint — semantic clash with Nigerian usage |
| `Condominium` | ❌ **BLOCKED** | DB constraint — no Nigerian legal equivalent |
| `ResidentialIncome` | ❌ Excluded | Nigerian ownership is unit-fragmented |
| `MobileHome`, `ManufacturedInPark`, etc. | ❌ Out of scope | Not relevant to Nigerian market |

---

## 7. The `Verity_NG_*` Custom Field Register (Full)

The complete list of Nigeria-specific custom fields used in MVP:

| Field | Type | Scope | Valid Values | Notes |
|---|---|---|---|---|
| `Verity_NG_HouseStyle` | VARCHAR(20) | Cat 2 (Residential House) | `Bungalow`, `Duplex`, `Terrace` | Required when Cat 2 selected |
| `Verity_NG_HouseAttachment` | VARCHAR(20) | Cat 2 | `Detached`, `SemiDetached` | Required when Cat 2 selected |
| `Verity_NG_ApartmentStyle` | VARCHAR(20) | Cat 3 (Apartment/Flat) | `Studio`, `StandardFlat`, `Penthouse`, `Maisonette` | Required when Cat 3 selected |
| `Verity_NG_LandZoning` | VARCHAR(20) | Cat 1 (Landed Property) | `Residential`, `Commercial`, `MixedUse`, `Industrial`, `Agricultural` | Required when Cat 1 selected |
| `Verity_NG_LandFeature` | VARCHAR(20) | Cat 1 | `Waterfront`, `Reclaimed`, `None` | Default `None`; can multi-tag in Phase 2 |
| `Verity_NG_HasBQ` | BOOLEAN | Cat 2 & 3 | `true`, `false` | Boys' Quarters toggle |
| `Verity_NG_BQConfig` | VARCHAR(20) | Cat 2 & 3 | `Attached`, `Detached`, `Rooftop` | Required if `Verity_NG_HasBQ = true` |
| `Verity_NG_BQSeparateTitle` | BOOLEAN | Cat 2 & 3 | `true`, `false` | Triggers analyst flag if `true` |
| `Verity_NG_BQBedroomsTotal` | SMALLINT | Cat 2 & 3 | Non-negative integer | BQ bedrooms count; defaults 0. Triggers analyst flag if `>= 3` AND `BQSeparateTitle = false` |
| `Verity_NG_BQBathroomsFull` | SMALLINT | Cat 2 & 3 | Non-negative integer | BQ-only count of full bathrooms; defaults 0 |
| `Verity_NG_BQBathroomsHalf` | SMALLINT | Cat 2 & 3 | Non-negative integer | BQ-only count of half bathrooms; defaults 0 |

### 7.1 RESO Bathroom Fields & BQ Extensions — Separate Implementation Standard

The bathroom + BQ extension field implementation is significant enough to warrant its own standalone reference document. See **VERITY RESO Bathroom Implementation v1.1** for the full specification covering all 7 RESO bathroom fields, the arithmetic decimal convention, the Boys' Quarters split (`BedroomsTotal`/`BathroomsFull`/`BathroomsHalf` for main building vs `Verity_NG_BQBedroomsTotal`/`Verity_NG_BQBathroomsFull`/`Verity_NG_BQBathroomsHalf` for BQ), the auto-compute trigger, UI design, analyst flag thresholds, and bank API implications.

Summary of the four RESO bathroom fields adopted in MVP:

| Field | Type | Purpose |
|---|---|---|
| `BathroomsFull` | SMALLINT (input) | Count of full bathrooms in main building |
| `BathroomsHalf` | SMALLINT (input) | Count of half bathrooms / powder rooms in main building |
| `BathroomsTotalInteger` | SMALLINT (derived) | Sum of full + half, whole count |
| `BathroomsTotalDecimal` | DECIMAL(3,1) (derived) | `BathroomsFull + (BathroomsHalf × 0.5)` — consumed by bank LOS comparables |

Plus three BQ extension fields in the `Verity_NG_*` namespace: `Verity_NG_BQBedroomsTotal`, `Verity_NG_BQBathroomsFull`, `Verity_NG_BQBathroomsHalf`. Analyst flag trigger: large BQ (3+ bedrooms) + no separate title → manual title verification.

`BathroomsThreeQuarter`, `BathroomsOneQuarter`, and `BathroomsPartial` are deferred to Phase 2 or excluded entirely.

### 7.2 Pan-African Namespace Convention

For Series B+ expansion, the namespace pattern is preserved:

- `Verity_NG_*` — Nigeria
- `Verity_GH_*` — Ghana (Year 4)
- `Verity_KE_*` — Kenya (Year 4)
- `Verity_ZA_*` — South Africa (Year 5)
- `Verity_EG_*` — Egypt (Year 5+)

**Critical principle:** RESO fields (`PropertyType`, `PropertySubType`, `CountyOrParish`, etc.) remain universal across all markets. Country-specific extensions live in country-specific namespaces. One graph, country-specific extensions. This is what makes Series B pan-African expansion architecturally cheap — Ghana doesn't require a new data model, just a new namespace and country-specific custom fields.

---

## 8. RESO Certification Roadmap

The MVP achieves the first certification level. Subsequent levels are scheduled by funding phase.

| Level | Target Phase | Business Value |
|---|---|---|
| RESO Compliant Data Dictionary | **MVP — now** | Data legible to any RESO-aware system |
| RESO Web API Core Endorsement | Month 9–12 (seed) | Required for RESO member org integration |
| RESO Web API Payloads | Series A | Bank bulk portfolio verification |
| Full RESO DD Certification | Series A | Strongest institutional credibility signal for bank API onboarding |

---

## 9. Where RESO Implementation Exists in the MVP

This is the comprehensive map of every MVP surface where RESO compliance has to be present — what the engineering and design teams need to build correctly the first time.

### 9.1 Backend — FastAPI (CTO + Sr. Engineer #1)

**PostgreSQL schema (`/app/db/schemas/properties.sql`):**
- All property table columns named with RESO PascalCase
- `Verity_NG_*` custom fields included
- Both blocking constraints in place (`chk_no_reso_duplex`, `chk_no_condominium`)
- `ListingKey` as primary key (UUID)
- `Verity_VPID` as unique secondary identifier

**API endpoints (`/app/api/v1/properties/`):**
- `POST /api/v1/properties` — accepts RESO-named fields in request body
- `GET /api/v1/properties` — returns RESO-named fields in response body, supports OData `$filter`
- `GET /api/v1/properties/{listing_key}` — single property fetch
- `PATCH /api/v1/properties/{listing_key}` — partial update with RESO field names

**Mapping service (`/app/services/property_mapping.py`):**
- UI category → `PropertyType` + `PropertySubType` derivation logic
- `Verity_NG_HouseStyle` + `Verity_NG_HouseAttachment` → `SingleFamilyResidence` / `Townhouse` mapping
- Validation that blocks `Duplex` and `Condominium` at API layer (in addition to DB constraint as defence in depth)

**OData filter parser (`/app/api/v1/odata_filter.py`):**
- Parses OData `$filter` syntax for bank API and marketplace queries
- Whitelists allowed RESO fields and `Verity_NG_*` fields
- Required for marketplace property search (Phase 2 — Month 9+)

### 9.2 Backend — VPID Service (CTO + Sr. Engineer #1)

**VPID table (`/app/db/schemas/vpid.sql`):**
- `vpid_properties` table uses RESO field names for joins to main properties table
- `Verity_VPID` column on properties table links to VPID record

**Confidence scoring service (`/app/services/confidence_scoring.py`):**
- Reads RESO fields to compute confidence band
- Writes `Verity_ConfidenceScore` (0-100) back to properties record

### 9.3 Backend — OCR Pipeline (Data Engineer / ML)

**Field extraction service (`/app/services/extraction/`):**
- Output schema uses RESO field names
- Custom field extractors map Nigerian document fields to `Verity_NG_*` namespace
- C of O extractor outputs `Verity_CofONumber`, `Verity_RegisteredOwner`, `Verity_TitleIssueDate`, `Verity_SurveyPlanRef`
- Deed of Assignment extractor maps to RESO + `Verity_*` fields

**Analyst QA queue:**
- Admin interface displays RESO field names with confidence badges
- Analyst overrides write back with RESO field names

### 9.4 Backend — Public Verification Endpoint (CTO)

**`GET /verify/{vpid}` (public, no auth):**
- Returns: VPID, `StandardStatus`, `Verity_ConfidenceScore`, confidence band, `PropertyType`, `Verity_LGA`, `Verity_TitleIssueDate`, `report_available` flag
- Does NOT return: `Verity_RegisteredOwner`, `Verity_CofONumber`, encumbrances, risk rating, analyst notes
- Rate limited 100 req/min/IP
- RESO field names in the JSON response (not buyer-friendly aliases) for institutional consistency

### 9.5 Frontend — Developer Dashboard (Boniface)

**TypeScript types (`/src/types/property.ts`):**
- `PropertyType`, `PropertySubType` typed against RESO enum
- `VerityNG_HouseStyle`, `VerityNG_ApartmentStyle`, `VerityNG_LandZoning`, `VerityNG_LandFeature`, `VerityNG_HouseAttachment` — all typed
- Compile-time guard against `PropertySubType = 'Duplex'` via union type narrowing

**Upload Property flow (`/src/features/properties/UploadPropertyFlow.tsx`):**
- Step 1: Property Details — 5-category selector at top level
- Conditional secondary selectors render based on Level 1 choice
- Form state stores Level 1 + Level 2 values, then submits RESO-mapped payload to API
- Validation enforces required `Verity_NG_*` fields for each category

**Portfolio List (`/src/features/properties/PortfolioList.tsx`):**
- Filter dropdowns use RESO field names internally and `Verity_NG_*` custom fields
- Filter UI produces OData `$filter` query string for API
- Filter examples:
  - "Show only duplexes": `PropertyType eq 'Residential' and Verity_NG_HouseStyle eq 'Duplex'`
  - "Show only waterfront plots": `PropertyType eq 'Land' and Verity_NG_LandFeature eq 'Waterfront'`

**Property Detail (`/src/features/properties/PropertyDetail.tsx`):**
- Overview tab displays all RESO + `Verity_NG_*` fields
- Field labels include the RESO field name as a small reso-tag pill alongside the human label
- BQ separate title amber callout rendered conditionally on `Verity_NG_BQSeparateTitle = true`

### 9.6 Frontend — Public Pages (Boniface)

**Public Verification Page (`/src/pages/PublicVerify.tsx`):**
- `verity.properties/verify/VRT-XXXXXXXXX`
- Displays `Verity_VPID`, `StandardStatus`, confidence band, `PropertyType`, `Verity_LGA`
- Conversion CTA: "Commission a Verification Report from ₦10,000"

### 9.7 Design System (Adebayo)

**Component library:**
- `PropertyTypeSelector` — 5-card Level 1 selector
- `LandedPropertySubSelector` — 5 sub-category cards + Waterfront/Reclaimed toggles
- `HouseStyleSelector` — Bungalow/Duplex/Terrace + Detached/SemiDetached
- `ApartmentStyleSelector` — Studio/StandardFlat/Penthouse/Maisonette
- `BQToggle` — Boolean toggle + conditional secondary selector
- `BQSeparateTitleCheckbox` — with amber callout state

**Field display patterns (`Verity_NG_*`):**
- `Verity_NG_HouseStyle` → property card secondary tag (gray-100 pill)
- `Verity_NG_ApartmentStyle` → property card secondary tag (gray-100 pill)
- `Verity_NG_LandZoning` → property card secondary tag (gray-100 pill)
- `Verity_NG_LandFeature` → premium badge (amber-light bg + amber text for Waterfront/Reclaimed)
- `Verity_NG_HasBQ` → property card tag (teal-light bg + teal text: "Includes BQ")
- `Verity_NG_BQSeparateTitle` → amber callout on property detail page

**Frame naming convention:**
- `M1-Upload-Property-Step1-CategorySelector`
- `M1-Upload-Property-Step1-HouseStyleSelector`
- `M1-PropertyDetail-Overview-RESOFields`
- `M3-VerificationReport-Page3-PropertyInformation` (PDF)

### 9.8 Verification Report PDF (CTO + Adebayo)

**Page 3 — Property Information:**
- Three sub-sections: Identification, Classification, Title & Registration
- Every field labelled with its RESO field name in a tag pill
- `Verity_NG_*` fields shown with teal-tinted tag
- Nigerian UPI format displayed: `NG-LA-{LGA}-{TitleType}:{TitleRef}`
- Generated by WeasyPrint from HTML/CSS template

**Cover page:**
- `PropertyType` and `PropertySubType` derived display ("Residential — Single-Family")
- VPID and VPR reference both shown (distinct)

### 9.9 Documentation (CPO)

**Cross-referenced in:**
- Tech Stack v1.1 (§2.2 schema, §2.3 mapping, §10 decision log)
- CTO Reference — Ruro v1.1 (§3 standards, §8 certification roadmap)
- Frontend Reference — Boniface v1.1 (§3 TypeScript types, §6 5-category selector)
- Designer Reference — Adebayo v1.1 (§3 selector, §5 `Verity_NG_*` display patterns)
- MVP PRD v1.1 (operational requirements)
- RESO Property Type Mapping — Nigeria v1 (standalone reference)
- Full Business Plan v1.1 (§7 tech architecture, §15 competitive moats)

---

## 10. MVP RESO Implementation — Definition of Done

The MVP is RESO-ready when ALL of the following are verifiably true:

1. **Database schema** uses RESO PascalCase field names; both blocking constraints active; all `Verity_NG_*` columns present.
2. **API contract** accepts and returns RESO field names; `PropertySubType = 'Duplex'` and `PropertySubType = 'Condominium'` rejected at API layer with 400 error and explanatory message.
3. **OData `$filter`** parses correctly for at least 3 representative queries (by `PropertyType`, by `Verity_NG_HouseStyle`, by combined RESO + custom field).
4. **TypeScript types** narrow against forbidden `PropertySubType` values at compile time.
5. **5-category UI selector** renders all 5 cards with Phase 2 categories disabled with explanatory tooltip.
6. **Mapping rules** correctly derive `PropertySubType` from UI choices for all combinations (tested against the matrix in §5).
7. **Verification report PDF Page 3** renders RESO field tags alongside every property field.
8. **Public verify endpoint** returns RESO-named fields only.
9. **OCR extractor outputs** map to RESO + `Verity_*` field names — no custom internal names leak to the database.
10. **CTO sign-off** on the architectural decision log entry recording the adoption.

---

## 11. Pan-African Implication

The architectural payoff for Series B+:

| Country | Year | What Changes | What Stays the Same |
|---|---|---|---|
| Ghana | 2029 | Add `Verity_GH_*` namespace fields for Ghana title types (e.g. `Verity_GH_LandTitle`) | RESO field names, VPID format, OData transport, OCR pipeline architecture |
| Kenya | 2029–30 | Add `Verity_KE_*` namespace fields | All of the above |
| South Africa | 2030–31 | Add `Verity_ZA_*` namespace fields (e.g. for Deeds Office reference numbers) | All of the above |

This is why the Series B pan-African expansion narrative in the Business Plan is architecturally credible. The data model doesn't change; only the country-specific extensions do.

---

## 12. Outstanding Items

| Item | Owner | Target |
|---|---|---|
| RESO Web API Core Endorsement application | CTO | Month 9–12 |
| RESO membership organisation enrolment (paid) | CEO + CPO | Month 6 |
| Bank API OAuth 2.0 + mTLS specification for pilot bank | CTO + Sales Lead | Month 12 |
| RESO Web API Payloads certification | CTO | Series A |

---

*v1.0 — April 2026 — Initial consolidated brief. Sourced from Tech Stack v1.1, CTO Reference v1.1, Frontend Reference v1.1, Designer Reference v1.1, MVP PRD v1.1, RESO Property Type Mapping — Nigeria v1, and Full Business Plan v1.1. Cross-references the standalone RESO Bathroom Implementation v1 document for full bathroom field specification.*

*v1.1 — April 2026 — Added `Verity_NG_BQBedroomsTotal` to the BQ extension field set in §4 canonical schema and §7 field register. Cross-reference updated to Bathroom Implementation v1.1.*
