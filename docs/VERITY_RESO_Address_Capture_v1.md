# VERITY Address Capture & RESO Standards Implementation v1

Created by: Ladi
Created time: May 25, 2026 4:36 PM
Category: Strategy doc
Last edited by: Ladi
Last updated time: May 25, 2026 4:36 PM

**Address Capture & RESO Standards Implementation**

|  |  |
| --- | --- |
| **Version** | 1.0 — April 2026 |
| **Status** | Internal — Engineering, Product & Design Reference |
| **Scope** | Property address capture for VERITY MVP — schema, form, RESO mapping, and reconciliation deferral |
| **Owner** | Ladi Awolaja — CPO |
| **Source documents** | RESO Adoption Brief v1.1, Tech Stack v1.1, CTO Reference — Ruro v1.1, Frontend Reference — Boniface v1.1, Designer Reference — Adebayo v1.1, Lagos & FCT Addressing Research v1 |

*STRICTLY CONFIDENTIAL — INTERNAL DOCUMENT*

---

## 1. The Standard

RESO Data Dictionary v2.0 models addresses using **roughly 15 fields** spanning three groups: parsed street components, locality components, and composite/geographic. The standard explicitly stores **both** parsed components (machine-queryable) and an unparsed display string (human-readable) for every address. VERITY adopts this dual-representation model from MVP.

The bathroom model's lesson applies equally here: capture cleanly named, RESO-compliant fields from day one. Never store free-text address blobs that have to be parsed later by every consumer.

This document specifies the seven fields VERITY captures in the MVP property upload form, their RESO mapping, the deferred reconciliation between City and Neighborhood (intentionally unresolved until market data informs the decision), and every MVP surface where address data is read or written.

---

## 2. The Seven Fields VERITY Captures in MVP

These are the seven fields agreed for the MVP property upload form:

| # | UI Field Label | Captures | Required? |
| --- | --- | --- | --- |
| 1 | Street address (Street number + Street name) | The physical street identifier | Yes |
| 2 | Plot No. | Government-allocated plot identifier (e.g. "Plot 14, Block 23") | Optional |
| 3 | LGA | Local Government Area | Yes |
| 4 | City | The city the property is in | Yes |
| 5 | State | The Nigerian state | Yes |
| 6 | Postal Code | NIPOST 6-digit postal code | Optional (auto-derived from geocode where possible) |
| 7 | Flat / Apt / Unit No. | Sub-property unit identifier | Optional |
| 8 | Neighborhood Area / Estate Name | The colloquial sub-city locality OR named estate | Optional but encouraged |

The numbering shows eight rows because "Street address" decomposes into two stored fields (StreetNumber + StreetName) even though it's captured as one combined input.

---

## 3. RESO Mapping (The Core Translation)

| VERITY Field | RESO Field(s) | Type | Notes |
| --- | --- | --- | --- |
| Street address | `StreetNumber`  • `StreetName`  • `StreetSuffix` | VARCHAR | Parsed at capture time via Google Places API |
| Plot No. | `Verity_NG_PlotNumber` | VARCHAR(50) | No standard RESO equivalent — Nigerian/British "plot" concept |
| LGA | `CountyOrParish` | VARCHAR(100) | Direct map. LGA = Nigerian county equivalent |
| City | `City` | VARCHAR(100) | Free-text in MVP. No controlled vocabulary yet. |
| State | `StateOrProvince` | VARCHAR(50) | Dropdown — 37 values (36 states + FCT) |
| Postal Code | `PostalCode` | VARCHAR(10) | NIPOST 6-digit numeric format |
| Flat / Apt / Unit No. | `UnitNumber` | VARCHAR(20) | RESO's single field for any sub-property unit identifier |
| Neighborhood / Estate Name | `Verity_NG_Neighborhood` | VARCHAR(150) | Custom namespace. Future target: `CityRegion` (for neighborhoods) + `SubdivisionName` (for estates) once market data informs the split |

### 3.1 Auto-Generated Fields

These fields are computed or geocoded automatically, not captured directly from the user:

| RESO Field | Type | Source |
| --- | --- | --- |
| `Country` | VARCHAR(2) | Default `'NG'` for MVP. ISO 3166-1 alpha-2 |
| `UnparsedAddress` | VARCHAR(500) | Composed from the parsed fields at write time |
| `Latitude` | DECIMAL(10,7) | Google Places geocode result (WGS84) |
| `Longitude` | DECIMAL(10,7) | Google Places geocode result (WGS84) |

---

## 4. The Full RESO Address Field Inventory

RESO defines ~15 address-related fields. Here's the full inventory with VERITY's MVP adoption status:

### 4.1 Parsed Street Components (Group A)

| RESO Field | Type | MVP? | Notes |
| --- | --- | --- | --- |
| `StreetNumber` | VARCHAR(20) | ✅ Yes | Alphanumeric (handles `12B`, `21A`, `7/4`) |
| `StreetNumberNumeric` | INT | ✅ Yes | Numeric portion only; for range queries |
| `StreetDirPrefix` | VARCHAR(5) | ❌ Phase 2 | Pre-direction (N/S/E/W) — uncommon in Nigeria |
| `StreetName` | VARCHAR(100) | ✅ Yes | Street name without suffix |
| `StreetSuffix` | VARCHAR(20) | ✅ Yes | Way, Road, Avenue, Close, Crescent, etc. |
| `StreetSuffixModifier` | VARCHAR(20) | ❌ Phase 2 | Post-suffix modifier (rare) |
| `StreetDirSuffix` | VARCHAR(5) | ❌ Phase 2 | Post-direction (N/S/E/W) |
| `UnitNumber` | VARCHAR(20) | ✅ Yes | Flat/Apt/Unit number |

### 4.2 Locality Components (Group B)

| RESO Field | Type | MVP? | Notes |
| --- | --- | --- | --- |
| `City` | VARCHAR(100) | ✅ Yes | Free-text in MVP (deferred vocabulary) |
| `StateOrProvince` | VARCHAR(50) | ✅ Yes | Dropdown of 37 values |
| `StateOrProvinceMnemonic` | VARCHAR(5) | ❌ Phase 2 | Standardised state code (e.g. `LA` for Lagos) |
| `CountyOrParish` | VARCHAR(100) | ✅ Yes | LGA |
| `Country` | VARCHAR(2) | ✅ Yes | ISO 3166-1 alpha-2 — `NG` default |
| `PostalCode` | VARCHAR(10) | ✅ Yes | NIPOST 6-digit numeric |
| `PostalCodePlus4` | VARCHAR(4) | ❌ Out of scope | US-specific extension |

### 4.3 Composite & Geographic (Group C)

| RESO Field | Type | MVP? | Notes |
| --- | --- | --- | --- |
| `UnparsedAddress` | VARCHAR(500) | ✅ Yes | Composed from parsed fields |
| `Latitude` | DECIMAL(10,7) | ✅ Yes | WGS84 |
| `Longitude` | DECIMAL(10,7) | ✅ Yes | WGS84 |

### 4.4 Sub-City Locality Fields (Group D — Area Group)

| RESO Field | Type | MVP? | Notes |
| --- | --- | --- | --- |
| `CityRegion` | VARCHAR(50) | ❌ Deferred | RESO field for sub-city neighborhoods (SoHo, Ironbound). Future target for VERITY's neighborhood capture once market data resolves the City vs Neighborhood reconciliation. |
| `SubdivisionName` | VARCHAR(120) | ❌ Deferred | RESO field for named estates / builder tracts (Banana Island, 1004 Estate, Lekki Peninsula Scheme). Future target for VERITY's estate capture. |
| `MLSAreaMajor` | VARCHAR(50) | ❌ Phase 2 | Marketing area (e.g. "Lekki Corridor") |
| `MLSAreaMinor` | VARCHAR(50) | ❌ Phase 2 | Sub-marketing area |
| `StateRegion` | VARCHAR(50) | ❌ Out of scope | US state region concept |
| `Township` | VARCHAR(80) | ❌ Phase 2 | Could carry LCDA (Lagos Council Development Area) |

### 4.5 VERITY Nigeria-Specific Extensions (Verity_NG_* Namespace)

| Field | Type | MVP? | Notes |
| --- | --- | --- | --- |
| `Verity_NG_PlotNumber` | VARCHAR(50) | ✅ Yes | Plot/Block identifier (Lagos Lands Bureau / AGIS concept) |
| `Verity_NG_Neighborhood` | VARCHAR(150) | ✅ Yes | Free-text. Will be split to `CityRegion`  • `SubdivisionName` later. |
| `Verity_NG_LGA` | VARCHAR(60) | ❌ Phase 2 | Denormalised mirror of `CountyOrParish` for clarity (optional) |
| `Verity_NG_LCDA` | VARCHAR(80) | ❌ Phase 2 | Lagos LCDA (37 values) |
| `Verity_NG_District` | VARCHAR(80) | ❌ Phase 2 | FCT-only — Maitama, Wuse II, Asokoro, etc. |
| `Verity_NG_CadastralZone` | VARCHAR(10) | ❌ Phase 2 | FCT AGIS code (A04, A05, etc.) |
| `Verity_NG_Scheme` | VARCHAR(120) | ❌ Phase 2 | Lagos Lands Bureau Scheme name |

---

## 5. The Deferred Reconciliation (City vs Neighborhood)

A critical product decision was deferred in v1.0: **VERITY does not yet enforce a controlled vocabulary for the `City` field, nor does it split user input between RESO `CityRegion` (neighborhood) and `SubdivisionName` (named estate).**

This is intentional. The rationale:

1. **No properties have been uploaded yet.** Speculating about the right City vocabulary or the right Neighborhood-vs-Estate split before observing how users actually enter address data is premature optimization.
2. **The market data will tell us.** Once 1,000–5,000 properties are uploaded, patterns will emerge: do users put "Lekki Phase 1" in City? In Neighborhood? In both? Do they call estates by their names ("Banana Island Estate") or by their geographic area ("Banana Island")? The dataset will answer this.
3. **Free-text capture preserves intent.** Storing whatever the user enters in `Verity_NG_Neighborhood` (free-text) means no information is lost to over-constrained input.
4. **The schema is wide enough to absorb the resolution.** Once the right reconciliation is clear, a backfill script splits `Verity_NG_Neighborhood` values into `CityRegion` and `SubdivisionName` based on patterns ("Phase X" → CityRegion; "Estate", "Scheme", "Court" suffixes → SubdivisionName).

### 5.1 What This Means for Engineering

- `City` is a free-text VARCHAR(100) input in MVP. No dropdown. No constraint.
- `Verity_NG_Neighborhood` is a free-text VARCHAR(150) input. No dropdown.
- The bank API documentation marks both fields as "MVP free-text — subject to reconciliation in Series A phase."
- No analyst flag, no validation rule, no mapping table for City or Neighborhood in MVP.

### 5.2 What This Means for Designers

- The form labels read naturally: "City", "Neighborhood Area / Estate Name".
- No autocomplete dropdown for City in MVP (Google Places suggestions on the Street address field will populate City automatically when available, but the user can override).
- The form does NOT push the user toward a particular vocabulary.

### 5.3 The Future Reconciliation (Series A Phase, Not Now)

When market data is available, the reconciliation will look like:

1. Audit `City` field — what values appeared? Define controlled vocabulary based on observed values + government taxonomy from the Lagos & FCT Addressing Research.
2. Audit `Verity_NG_Neighborhood` — classify each value as either a CityRegion (geographic locality) or a SubdivisionName (named estate) using pattern matching + analyst review.
3. Backfill `CityRegion` and `SubdivisionName` columns from the classified data.
4. Update the form UI to use cascading dropdowns or autocomplete based on the validated vocabulary.
5. Notify bank API consumers of the schema enrichment (additive — no breaking changes).

---

## 6. The PostgreSQL Schema

### 6.1 Schema Patch (Apply After Current Schema)

```sql
ALTER TABLE properties
  -- Parsed RESO street components
  ADD COLUMN StreetNumber           VARCHAR(20),
  ADD COLUMN StreetNumberNumeric    INTEGER,
  ADD COLUMN StreetName             VARCHAR(100),
  ADD COLUMN StreetSuffix           VARCHAR(20),
  ADD COLUMN UnitNumber             VARCHAR(20),
  
  -- Locality (City is already in core schema; verify presence)
  ADD COLUMN City                   VARCHAR(100),
  
  -- VERITY Nigeria-specific extensions
  ADD COLUMN Verity_NG_PlotNumber   VARCHAR(50),
  ADD COLUMN Verity_NG_Neighborhood VARCHAR(150);

-- CountyOrParish, StateOrProvince, Country, PostalCode,
-- UnparsedAddress, Latitude, Longitude already exist in the core schema
-- (per Tech Stack v1.1 §2.2). Verify they are VARCHAR(100), VARCHAR(50),
-- VARCHAR(2), VARCHAR(10), VARCHAR(500), DECIMAL(10,7), DECIMAL(10,7)
-- respectively.
```

### 6.2 Validation Constraints

```sql
ALTER TABLE properties
  -- Address presence: require either UnparsedAddress OR (StreetName + City)
  ADD CONSTRAINT chk_address_present CHECK (
    UnparsedAddress IS NOT NULL OR
    (StreetName IS NOT NULL AND City IS NOT NULL)
  ),
  
  -- StreetNumberNumeric, if provided, must be positive
  ADD CONSTRAINT chk_street_number_numeric_positive CHECK (
    StreetNumberNumeric IS NULL OR StreetNumberNumeric > 0
  );

-- Note: No constraint on City or Verity_NG_Neighborhood values.
-- These are intentionally free-text in MVP per §5.
```

### 6.3 Indexes for Query Performance

```sql
-- Index on the most common filter fields for marketplace search
CREATE INDEX idx_properties_state    ON properties(StateOrProvince);
CREATE INDEX idx_properties_city     ON properties(City);
CREATE INDEX idx_properties_lga      ON properties(CountyOrParish);
CREATE INDEX idx_properties_postcode ON properties(PostalCode);

-- Spatial index for proximity queries (PostGIS — already in VPID architecture)
CREATE INDEX idx_properties_geo ON properties USING GIST (
  ST_SetSRID(ST_MakePoint(Longitude, Latitude), 4326)
);

-- Full-text on the neighborhood field for marketplace search
CREATE INDEX idx_properties_neighborhood_fts
  ON properties USING GIN (to_tsvector('english', Verity_NG_Neighborhood));
```

---

## 7. API Contract

### 7.1 Request — POST /api/v1/properties (Property Upload)

```json
{
  "PropertyType": "Residential",
  "PropertySubType": "SingleFamilyResidence",
  "Verity_NG_HouseStyle": "Duplex",
  "Verity_NG_HouseAttachment": "Detached",
  "BedroomsTotal": 4,
  "BathroomsFull": 4,
  "BathroomsHalf": 2,
  
  "StreetNumber": "12B",
  "StreetName": "Admiralty",
  "StreetSuffix": "Way",
  "UnitNumber": null,
  "Verity_NG_PlotNumber": "Plot 14, Block 23",
  "Verity_NG_Neighborhood": "Lekki Phase 1",
  "City": "Lekki",
  "CountyOrParish": "Eti-Osa",
  "StateOrProvince": "Lagos",
  "Country": "NG",
  "PostalCode": "106104",
  "Latitude": 6.4350000,
  "Longitude": 3.4569000
}
```

The API accepts the parsed components. The geocoder client-side or server-side has already split the street address into `StreetNumber` + `StreetName` + `StreetSuffix`.

### 7.2 Auto-Computed at Write Time

The server constructs `UnparsedAddress` at write time:

```python
def build_unparsed_address(p: dict) -> str:
    parts = []
    
    # Street line
    street = " ".join(filter(None, [
        p.get("StreetNumber"),
        p.get("StreetName"),
        p.get("StreetSuffix"),
    ]))
    if street:
        parts.append(street)
    if p.get("UnitNumber"):
        parts.append(f"Unit {p['UnitNumber']}")
    if p.get("Verity_NG_PlotNumber"):
        parts.append(p["Verity_NG_PlotNumber"])
    
    # Locality
    if p.get("Verity_NG_Neighborhood"):
        parts.append(p["Verity_NG_Neighborhood"])
    if p.get("City"):
        parts.append(p["City"])
    if p.get("CountyOrParish"):
        parts.append(f"{p['CountyOrParish']} LGA")
    if p.get("StateOrProvince"):
        parts.append(p["StateOrProvince"])
    
    return ", ".join(parts)
```

Also computes `StreetNumberNumeric` by extracting the numeric prefix from `StreetNumber`:

```python
import re

def extract_street_number_numeric(s: str) -> int | None:
    if not s:
        return None
    m = re.match(r"^(\d+)", s)
    return int(m.group(1)) if m else None
```

### 7.3 Response — GET /api/v1/properties/{listing_key}

```json
{
  "ListingKey": "8f3e2a1c-...",
  "Verity_VPID": "VRT-7K2M9PXQR8",
  "PropertyType": "Residential",
  "PropertySubType": "SingleFamilyResidence",
  
  "StreetNumber": "12B",
  "StreetNumberNumeric": 12,
  "StreetName": "Admiralty",
  "StreetSuffix": "Way",
  "UnitNumber": null,
  "Verity_NG_PlotNumber": "Plot 14, Block 23",
  "Verity_NG_Neighborhood": "Lekki Phase 1",
  "City": "Lekki",
  "CountyOrParish": "Eti-Osa",
  "StateOrProvince": "Lagos",
  "Country": "NG",
  "PostalCode": "106104",
  "UnparsedAddress": "12B Admiralty Way, Plot 14, Block 23, Lekki Phase 1, Lekki, Eti-Osa LGA, Lagos",
  "Latitude": 6.4350000,
  "Longitude": 3.4569000
}
```

### 7.4 OData $filter Examples

```
# All properties in a given state
GET /api/v1/properties?$filter=StateOrProvince eq 'Lagos'

# All properties in a given LGA
GET /api/v1/properties?$filter=CountyOrParish eq 'Eti-Osa'

# Lagos properties on Admiralty Way
GET /api/v1/properties?$filter=City eq 'Lekki' 
  and StreetName eq 'Admiralty'

# Properties with a postal code prefix (Lekki cluster)
GET /api/v1/properties?$filter=startswith(PostalCode, '1061')

# Properties with neighborhood matching "Lekki"
GET /api/v1/properties?$filter=contains(Verity_NG_Neighborhood, 'Lekki')

# Spatial query handled outside OData via PostGIS endpoint
GET /api/v1/properties/nearby?lat=6.4350&lng=3.4569&radius_km=2
```

---

## 8. TypeScript Types (Frontend)

```tsx
// src/types/address.ts

export interface AddressFields {
  // Parsed RESO street components
  StreetNumber: string | null;            // e.g. "12B"
  StreetNumberNumeric: number | null;     // derived: 12
  StreetName: string | null;              // e.g. "Admiralty"
  StreetSuffix: string | null;            // e.g. "Way"
  UnitNumber: string | null;              // e.g. "Flat 3"
  
  // VERITY Nigeria-specific extensions
  Verity_NG_PlotNumber: string | null;    // e.g. "Plot 14, Block 23"
  Verity_NG_Neighborhood: string | null;  // e.g. "Lekki Phase 1"
  
  // Locality
  City: string | null;                    // e.g. "Lekki" — FREE TEXT IN MVP
  CountyOrParish: string;                 // e.g. "Eti-Osa" — required, dropdown
  StateOrProvince: string;                // e.g. "Lagos" — required, dropdown
  Country: string;                        // "NG" default
  PostalCode: string | null;              // e.g. "106104"
  
  // Composite & geographic
  UnparsedAddress: string;                // derived server-side
  Latitude: number | null;                // WGS84
  Longitude: number | null;               // WGS84
}

// Common Nigerian street suffixes — for the StreetSuffix dropdown
export const NG_STREET_SUFFIXES = [
  'Street', 'Road', 'Avenue', 'Way', 'Drive', 'Lane', 'Close',
  'Crescent', 'Boulevard', 'Court', 'Place', 'Walk', 'Estate',
  'Phase', 'Park',
] as const;

// 36 states + FCT
export const NG_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti',
  'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
  'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
] as const;

// Lagos LGAs (20 constitutional)
export const LAGOS_LGAS = [
  'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa',
  'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye',
  'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland',
  'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere',
] as const;

// FCT Area Councils (6 constitutional)
export const FCT_AREA_COUNCILS = [
  'AMAC', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji',
] as const;
```

### 8.1 Zod Validation Schema

```tsx
// src/features/properties/addressSchema.ts

import { z } from 'zod';
import { NG_STATES, NG_STREET_SUFFIXES } from '@/types/address';

export const addressFieldsSchema = z.object({
  // Parsed street — at least StreetName required
  StreetNumber: z.string().max(20).optional(),
  StreetName: z.string().min(1, 'Street name is required').max(100),
  StreetSuffix: z.enum(NG_STREET_SUFFIXES).optional(),
  UnitNumber: z.string().max(20).optional(),
  
  // VERITY Nigeria extensions
  Verity_NG_PlotNumber: z.string().max(50).optional(),
  Verity_NG_Neighborhood: z.string().max(150).optional(),
  
  // Locality — City + LGA + State required
  City: z.string().min(1, 'City is required').max(100),
  CountyOrParish: z.string().min(1, 'LGA is required').max(100),
  StateOrProvince: z.enum(NG_STATES, {
    errorMap: () => ({ message: 'Please select a Nigerian state' })
  }),
  Country: z.string().length(2).default('NG'),
  PostalCode: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits').optional(),
  
  // Geocode — at least one of (UnparsedAddress, Lat+Lng) recommended
  Latitude: z.number().min(-90).max(90).optional(),
  Longitude: z.number().min(-180).max(180).optional(),
});
```

### 8.2 Display Formatter

```tsx
// src/lib/formatAddress.ts

export function formatAddressOneLine(a: AddressFields): string {
  return a.UnparsedAddress || buildUnparsedAddress(a);
}

export function formatAddressTwoLine(a: AddressFields): { line1: string; line2: string } {
  const line1Parts = [
    [a.StreetNumber, a.StreetName, a.StreetSuffix].filter(Boolean).join(' '),
    a.UnitNumber ? `Unit ${a.UnitNumber}` : null,
    a.Verity_NG_PlotNumber,
  ].filter(Boolean);
  
  const line2Parts = [
    a.Verity_NG_Neighborhood,
    a.City,
    a.CountyOrParish ? `${a.CountyOrParish} LGA` : null,
    a.StateOrProvince,
  ].filter(Boolean);
  
  return {
    line1: line1Parts.join(', '),
    line2: line2Parts.join(', '),
  };
}

function buildUnparsedAddress(a: AddressFields): string {
  const all = [
    [a.StreetNumber, a.StreetName, a.StreetSuffix].filter(Boolean).join(' '),
    a.UnitNumber ? `Unit ${a.UnitNumber}` : null,
    a.Verity_NG_PlotNumber,
    a.Verity_NG_Neighborhood,
    a.City,
    a.CountyOrParish ? `${a.CountyOrParish} LGA` : null,
    a.StateOrProvince,
  ];
  return all.filter(Boolean).join(', ');
}
```

---

## 9. UI Implementation — Property Upload Flow

The address capture lives in Step 1 (Property Details) of the property upload flow, before Property Specifications (bathrooms, rooms) and Title Information.

### 9.1 Form Layout

```
┌─────────────────────────────────────────────────────────┐
│  PROPERTY ADDRESS                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Street address                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ 12B Admiralty Way                              │    │
│  └────────────────────────────────────────────────┘    │
│  ↑ Google Places autocomplete suggests as user types   │
│                                                         │
│  Plot number / Block number   (optional)               │
│  ┌────────────────────────────────────────────────┐    │
│  │ Plot 14, Block 23                              │    │
│  └────────────────────────────────────────────────┘    │
│  💡 Found on your Certificate of Occupancy             │
│                                                         │
│  Flat / Apartment / Unit number   (optional)           │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  Neighborhood or estate name   (optional)              │
│  ┌────────────────────────────────────────────────┐    │
│  │ Lekki Phase 1                                  │    │
│  └────────────────────────────────────────────────┘    │
│  💡 e.g. "Lekki Phase 1", "Banana Island Estate",      │
│     "Magodo GRA Phase 2"                                │
│                                                         │
│  ─────────────────────────────────────────────────     │
│                                                         │
│  City                          LGA                      │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │ Lekki            │         │ Eti-Osa        ▼ │    │
│  └──────────────────┘         └──────────────────┘    │
│                                                         │
│  State                         Postal code              │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │ Lagos          ▼ │         │ 106104           │    │
│  └──────────────────┘         └──────────────────┘    │
│                                                         │
│  ─────────────────────────────────────────────────     │
│                                                         │
│  📍 Preview                                             │
│  ┌────────────────────────────────────────────────┐    │
│  │  [ Google Map showing the geocoded location  ] │    │
│  │  Latitude: 6.4350°N · Longitude: 3.4569°E      │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Field Interaction Rules

| Field | Type | Behaviour |
| --- | --- | --- |
| Street address | Combined input with Google Places autocomplete | Single text input; on select-from-suggestions, the API result populates `City`, `CountyOrParish` (when available), `StateOrProvince`, `PostalCode`, `Latitude`, `Longitude`. All fields remain user-editable. |
| Plot number | Text input | Free text. No validation. Tooltip: "Found on your Certificate of Occupancy" |
| Flat / Unit | Text input | Free text. No validation. |
| Neighborhood / Estate Name | Text input | Free text in MVP. Tooltip with examples. No autocomplete. |
| City | Text input | **Free text in MVP. No dropdown.** Pre-filled from Google Places result; user-editable. |
| LGA | Dropdown | Driven by `StateOrProvince`. Lagos shows 20 LGAs; FCT shows 6 Area Councils; other states show their LGAs. |
| State | Dropdown | 37 values (36 states + FCT). |
| Postal Code | Text input | 6-digit numeric. Pre-filled from Google Places; user-editable. |

### 9.3 Geocode-First Pattern

The recommended UX pattern: the user types the street address; Google Places suggests; on selection, the parsed fields are populated and the map preview updates. The user can override any field.

If Google Places returns no match (informal settlements, unmapped areas), the user falls back to manual entry. The Latitude/Longitude can be set by dragging a pin on the map preview.

### 9.4 Validation Behaviour

- **Required fields:** Street name, City, LGA, State.
- **Optional fields:** Street number, Plot number, Flat/Unit, Neighborhood, Postal code, Lat/Lng.
- **Inline validation:** Postal code (if entered) must be 6 digits — error appears below the field.
- **Submission validation:** At least Street name + City must be present.
- **Server validation:** Final check on submit — server computes `UnparsedAddress` and `StreetNumberNumeric`.

### 9.5 Mobile Layout (Tailwind)

The same content stacks vertically on mobile. Each input full-width. The LGA and State dropdowns stack instead of sitting side-by-side. The map preview is collapsible (default expanded).

---

## 10. Verification Report PDF — Address Display

### 10.1 Page 1 — Cover

The cover shows the address in two visual lines:

```
Property Address

12B Admiralty Way · Plot 14, Block 23
Lekki Phase 1, Lekki, Eti-Osa LGA, Lagos · 106104
```

### 10.2 Page 3 — Property Information (Address Section)

The full property information page includes an Address section with every RESO field tagged:

```
┌─────────────────────────────────────────────────────────┐
│  ADDRESS                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Street address                                         │
│    StreetNumber          12B                            │
│    StreetName            Admiralty                      │
│    StreetSuffix          Way                            │
│    UnitNumber            —                              │
│                                                         │
│  Plot number                                            │
│    Verity_NG_PlotNumber  Plot 14, Block 23              │
│                                                         │
│  Locality                                               │
│    Verity_NG_Neighborhood  Lekki Phase 1                │
│    City                  Lekki                          │
│    CountyOrParish        Eti-Osa LGA                    │
│    StateOrProvince       Lagos                          │
│    Country               Nigeria                        │
│    PostalCode            106104                         │
│                                                         │
│  Geographic                                             │
│    Latitude              6.4350° N                      │
│    Longitude             3.4569° E                      │
│                                                         │
│  Composed address                                       │
│    UnparsedAddress       12B Admiralty Way,             │
│                          Plot 14, Block 23,             │
│                          Lekki Phase 1, Lekki,          │
│                          Eti-Osa LGA, Lagos             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

The RESO field tags appear as small gray-100 pills next to each field label, consistent with the rest of the property information page.

---

## 11. OCR Pipeline — Where Address Data Comes From

Unlike room counts (which don't appear on title documents), **address data IS extracted from C of Os, Deeds of Assignment, Survey Plans, and Governor's Consent forms.** The OCR pipeline contributes to the address record.

### 11.1 Address Fields the OCR Pipeline Extracts

| Field | Source documents | Extraction confidence target |
| --- | --- | --- |
| `StreetNumber`  • `StreetName` | C of O, Deed of Assignment | ≥ 85% |
| `Verity_NG_PlotNumber` | C of O, Survey Plan, Governor's Consent | ≥ 90% |
| `CountyOrParish` (LGA) | C of O, Deed of Assignment | ≥ 90% |
| `StateOrProvince` | C of O, Deed of Assignment | ≥ 95% |
| `Verity_NG_Scheme` (Phase 2) | C of O, Lagos State Lands Bureau records | ≥ 85% |

Fields like `City`, `Verity_NG_Neighborhood`, `PostalCode`, `UnitNumber`, `Latitude`, `Longitude` typically do not appear on title documents and come from user self-report + geocoding.

### 11.2 Reconciliation Logic in the OCR Pipeline

When the OCR pipeline extracts address fields that conflict with the user's self-report:

1. **Plot number conflict:** Analyst flag. Human reviews both values, picks the correct one.
2. **LGA conflict:** Analyst flag. The C of O is authoritative; user's input is corrected.
3. **State conflict:** Critical flag. The C of O is always authoritative.
4. **Street name conflict:** Soft flag. Streets get renamed; both values may be valid. Analyst confirms.

### 11.3 OCR Output Schema

```python
# app/services/extraction/address_extractor.py — output format
{
    "extracted_fields": {
        "Verity_CofONumber": {"value": "LO/2018/AC/004721", "confidence": 0.94},
        "Verity_NG_PlotNumber": {"value": "Plot 14, Block 23", "confidence": 0.91},
        "CountyOrParish": {"value": "Eti-Osa", "confidence": 0.95},
        "StateOrProvince": {"value": "Lagos", "confidence": 0.98},
        "StreetName": {"value": "Admiralty Way", "confidence": 0.82},
    },
    "raw_text": "...",
    "document_type": "CertificateOfOccupancy"
}
```

The extracted values are written to the property record only if confidence exceeds the threshold OR the analyst approves them during QA.

---

## 12. Geocoding Integration (Google Places)

### 12.1 The Geocode Flow

1. User starts typing in the Street address field.
2. Frontend calls Google Places Autocomplete API (`/place/autocomplete/json`) with `country=NG` and `types=address` filters.
3. User selects a suggestion.
4. Frontend calls Google Place Details API (`/place/details/json`) with the selected `place_id` to get the full address components and lat/lng.
5. Frontend parses the `address_components` array and populates the corresponding form fields.
6. User can override any pre-filled value.

### 12.2 Mapping Google Place Result to RESO

Google Places returns `address_components` with `types`. The mapping:

| Google `types` | RESO Field |
| --- | --- |
| `street_number` | `StreetNumber` |
| `route` | `StreetName`  • parse for `StreetSuffix` |
| `subpremise` | `UnitNumber` |
| `sublocality_level_1` or `neighborhood` | `Verity_NG_Neighborhood` |
| `locality` | `City` |
| `administrative_area_level_2` | `CountyOrParish` (LGA) |
| `administrative_area_level_1` | `StateOrProvince` |
| `country` | `Country` (ISO code from `short_name`) |
| `postal_code` | `PostalCode` |
| `geometry.location.lat` | `Latitude` |
| `geometry.location.lng` | `Longitude` |

### 12.3 Server-Side Geocode Validation (Optional)

For institutional uploads (developer SaaS, bulk uploads), the server can re-geocode the submitted address to verify the user-provided lat/lng is plausible. If the server geocode result is > 500m from the user's lat/lng, an analyst flag is raised.

### 12.4 Geocode Failure Handling

If Google Places returns no match (informal settlements, very new addresses):

1. The form falls back to fully manual entry.
2. The map preview shows a center point on Lagos (or the selected State) with a draggable pin.
3. User drags the pin to the property location; `Latitude`/`Longitude` are set from the pin.
4. `UnparsedAddress` is composed from the manually-entered parsed fields.

---

## 13. MVP Implementation Surfaces

| Surface | Owner | Change Required |
| --- | --- | --- |
| PostgreSQL schema | CTO + Sr. Engineer #1 | Add 8 new columns (StreetNumber, StreetNumberNumeric, StreetName, StreetSuffix, UnitNumber, Verity_NG_PlotNumber, Verity_NG_Neighborhood, City); add constraints; add 5 indexes |
| FastAPI endpoint validation | Sr. Engineer #1 | Accept parsed address fields in POST/PATCH; compose UnparsedAddress at write time; compute StreetNumberNumeric from StreetNumber |
| OData filter parser | Sr. Engineer #1 | Whitelist all address fields for `$filter` queries; support `startswith`, `contains`, `eq`, `ge`, `le` on string fields |
| Address builder service | Sr. Engineer #1 | `build_unparsed_address()` and `extract_street_number_numeric()` utility functions |
| Geocoding service | Sr. Engineer #1 | Google Places API integration; address_components → RESO field mapping; optional server-side re-geocode for validation |
| OCR pipeline — address extractor | Data Engineer / ML | Custom Python extractor for `StreetNumber`, `StreetName`, `Verity_NG_PlotNumber`, `CountyOrParish`, `StateOrProvince` from C of O, Deed of Assignment, Survey Plan |
| OCR reconciliation logic | Data Engineer / ML + CTO | Analyst flag rules when OCR-extracted address fields conflict with user self-report |
| TypeScript types | Boniface | Add `AddressFields` interface; add `NG_STATES`, `LAGOS_LGAS`, `FCT_AREA_COUNCILS`, `NG_STREET_SUFFIXES` enums; add Zod validation schema |
| Upload Property flow | Boniface + Adebayo | New Address section in Step 1 with 7-field capture; Google Places autocomplete integration; map preview with draggable pin |
| Cascading LGA dropdown | Boniface | LGA options driven by selected State; preserve user selection on state change if valid |
| Map preview component | Boniface | Google Maps embed showing geocoded location; draggable pin for manual override |
| Property Detail page | Boniface + Adebayo | Display all RESO address fields with tags; two-line address render at the top |
| Verification Report PDF | CTO (WeasyPrint) + Adebayo | Update Page 1 cover address rendering; update Page 3 Property Information to include the Address section with RESO tags |
| Public verify endpoint | CTO | Return safe address fields: `StateOrProvince`, `City`, `CountyOrParish`, `Verity_NG_Neighborhood`, `PostalCode`. Do NOT return `StreetNumber`, `StreetName`, `UnitNumber`, `Verity_NG_PlotNumber`, `Latitude`, `Longitude` (privacy) |
| Bank API documentation | CTO | Document address fields in OData schema documentation for pilot bank; mark `City` and `Verity_NG_Neighborhood` as "MVP free-text — subject to reconciliation in Series A" |
| Analyst QA queue UI | CTO + Adebayo | Show address fields side-by-side (user entry vs OCR extraction) for analyst review |
| Test data fixtures | Sr. Engineer #1 | Generate Lagos and FCT property fixtures with realistic Nigerian addresses |

---

## 14. Edge Cases & Conventions

### 14.1 Alphanumeric Street Numbers

Lagos house numbering is frequently alphanumeric (`12B`, `21A`, `7/4`, `Plot 25`). The schema handles this:

- `StreetNumber` is VARCHAR(20) — accepts any string.
- `StreetNumberNumeric` extracts the leading numeric portion for range queries.
- For `Plot 25` (no traditional street number), `StreetNumber` may be empty and `Verity_NG_PlotNumber` carries the identifier.

### 14.2 Properties Without Formal Street Addresses

Informal settlements and properties without street numbers:

- `StreetName` may carry a landmark reference instead ("Behind the Mosque").
- `StreetNumber` is empty.
- `Latitude` + `Longitude` from a manually-dragged pin become the primary locational signal.
- `Verity_NG_Neighborhood` may carry the community name.

### 14.3 The City Field — Intentionally Unstructured

Per §5, the `City` field is free-text in MVP. Expected user inputs may include:

- "Lagos"
- "Lekki"
- "Eti-Osa" (an LGA name used colloquially as city)
- "VI" (Victoria Island)
- "Ikoyi"

All of these are valid inputs in MVP. The variation IS the data we want to collect.

### 14.4 The LGA Dropdown — The Settled Field

Unlike City, LGA has a constitutional definition (20 in Lagos, 6 in FCT). The dropdown is the only address field with a strict controlled vocabulary in MVP. The 20 Lagos LGAs and 6 FCT Area Councils are hardcoded.

### 14.5 Postal Code — Optional But Encouraged

NIPOST coverage is incomplete and Nigerian postal code adoption is inconsistent. The field is optional. When the user doesn't provide one, the system attempts to derive it from the geocode result. When neither is available, the field is left null.

### 14.6 Country Default

`Country` defaults to `'NG'` (ISO 3166-1 alpha-2). For pan-African expansion, the field becomes user-selectable.

### 14.7 Lat/Lng Without Address

A property with valid Lat/Lng but no resolved street address is still uploadable (e.g. via the manual pin-drop flow). `UnparsedAddress` is composed from whatever locality fields are populated.

### 14.8 Address Updates After Upload

When an address is corrected (analyst override, user edit), the previous values are retained in the `vpid_lineage` table (existing VPID architecture — no address-specific change needed). This provides an audit trail.

---

## 15. Bank API Implications

The Year 5 bank mortgage API (₦8B+ revenue line) consumes the address data for three purposes:

### 15.1 Geographic Identification

Banks need to know **which LGA and State** a property is in for:

- Regional concentration risk in the mortgage portfolio.
- State-specific lending regulations.
- Geographic stratification of underwriting.

VERITY provides `CountyOrParish` and `StateOrProvince` cleanly. Bank LOS systems consume these directly without translation.

### 15.2 Valuation Comparables

Banks compare a subject property against similar properties in the same area. The granularity needed is below the LGA level (an LGA can span 500K+ residents). The bank uses, in order of preference:

1. `Verity_NG_Neighborhood` (when available)
2. `City`
3. `PostalCode` prefix (4-digit dispatch district)

Because `Verity_NG_Neighborhood` is currently free-text, banks will use approximate string matching (Levenshtein distance, fuzzy match) until VERITY's reconciliation produces a controlled vocabulary.

### 15.3 KYC Address Matching

Banks cross-reference the property address against the developer's registered business address (CAC data) and the buyer's NIN-registered residence (NIMC data). The NIMC NIN system uses a `Town/City of Residence` + `LGA of Residence` + `State of Residence` split — VERITY's schema is isomorphic. The match is direct.

### 15.4 What VERITY Documents to the Bank

The bank API documentation will mark:

- `City` as MVP free-text, subject to reconciliation Series A phase.
- `Verity_NG_Neighborhood` as MVP free-text, subject to reconciliation Series A phase.
- All other address fields as stable and consumable.

This is honest disclosure. Banks expect maturity to grow with the platform.

---

## 16. Schema Patch Migration Plan

This is a green-field migration — no existing properties have been uploaded, so no data backfill is needed.

```sql
-- Migration: 2026_04_28_add_address_fields.sql

-- Stage 1: Add parsed street components
ALTER TABLE properties
  ADD COLUMN StreetNumber           VARCHAR(20),
  ADD COLUMN StreetNumberNumeric    INTEGER,
  ADD COLUMN StreetName             VARCHAR(100),
  ADD COLUMN StreetSuffix           VARCHAR(20),
  ADD COLUMN UnitNumber             VARCHAR(20);

-- Stage 2: Add VERITY Nigeria-specific extensions
ALTER TABLE properties
  ADD COLUMN Verity_NG_PlotNumber   VARCHAR(50),
  ADD COLUMN Verity_NG_Neighborhood VARCHAR(150);

-- Stage 3: Ensure City column exists (per Tech Stack v1.1 it should already)
-- If not present, add it:
-- ALTER TABLE properties ADD COLUMN City VARCHAR(100);

-- Stage 4: Add validation constraints
ALTER TABLE properties
  ADD CONSTRAINT chk_address_present CHECK (
    UnparsedAddress IS NOT NULL OR
    (StreetName IS NOT NULL AND City IS NOT NULL)
  ),
  ADD CONSTRAINT chk_street_number_numeric_positive CHECK (
    StreetNumberNumeric IS NULL OR StreetNumberNumeric > 0
  );

-- Stage 5: Add indexes
CREATE INDEX idx_properties_state    ON properties(StateOrProvince);
CREATE INDEX idx_properties_city     ON properties(City);
CREATE INDEX idx_properties_lga      ON properties(CountyOrParish);
CREATE INDEX idx_properties_postcode ON properties(PostalCode);

CREATE INDEX idx_properties_geo ON properties USING GIST (
  ST_SetSRID(ST_MakePoint(Longitude, Latitude), 4326)
);

CREATE INDEX idx_properties_neighborhood_fts
  ON properties USING GIN (to_tsvector('english', Verity_NG_Neighborhood));
```

Run in a single transaction. No rollback complexity — these are pure additions.

---

## 17. Definition of Done

The address capture implementation is complete when ALL of the following are verifiably true:

1. **PostgreSQL schema** contains `StreetNumber`, `StreetNumberNumeric`, `StreetName`, `StreetSuffix`, `UnitNumber`, `Verity_NG_PlotNumber`, `Verity_NG_Neighborhood`, `City`; plus the previously-existing locality and geographic fields.
2. **API contract** accepts the parsed input fields and returns the full set (including derived `UnparsedAddress` and `StreetNumberNumeric`).
3. **OData `$filter` queries** work on all address fields including `startswith`, `contains` for partial matching on string fields.
4. **TypeScript types** include the full `AddressFields` interface, all enum constants, the Zod validation schema, and the `formatAddress*` helpers.
5. **Upload Property flow** has the new Address section with Google Places autocomplete, cascading LGA dropdown, map preview with draggable pin, and all field validations.
6. **Property Detail page** renders the address with RESO field tags in a two-line format at the top and a full Address section in the property information panel.
7. **Verification Report PDF** Page 1 cover shows the two-line address; Page 3 Property Information renders the Address section with all RESO field tags.
8. **Public verify endpoint** returns only the safe address subset (`StateOrProvince`, `City`, `CountyOrParish`, `Verity_NG_Neighborhood`, `PostalCode`); withholds street-level detail and lat/lng for privacy.
9. **OCR address extractor** outputs RESO-named fields with confidence scores; reconciliation flags surface in the analyst QA queue when OCR conflicts with user self-report.
10. **Migration script** runs cleanly; no data loss (none to lose — green-field).
11. **Test coverage** includes:
    - Unit tests for `buildUnparsedAddress()` and `extractStreetNumberNumeric()`
    - Integration tests for the POST /api/v1/properties endpoint with the full address payload
    - E2E tests for the Upload Property form with Google Places autocomplete and manual fallback
    - OCR extraction tests on at least 20 sample C of O documents

---

## 18. Phase 2 / Future Roadmap

Items deferred from MVP:

| Field / Feature | Phase | Reason for Deferral |
| --- | --- | --- |
| `CityRegion` controlled vocabulary | Series A | Wait for market data on how users enter neighborhood values |
| `SubdivisionName` controlled vocabulary | Series A | Same as above — need market signal on neighborhood vs estate split |
| `StateOrProvinceMnemonic` | Series A | Useful for bank API normalization; not blocking in MVP |
| `Verity_NG_LCDA` (37 Lagos LCDAs) | Series A | Useful for hyperlocal queries; not needed until property volume justifies it |
| `Verity_NG_District` (FCT districts) | Series A | Same logic as LCDA — wait for FCT property volume |
| `Verity_NG_CadastralZone` (FCT AGIS codes) | Phase 3 | Useful only when AGIS API integration is in scope |
| `Verity_NG_Scheme` (Lagos Lands Bureau schemes) | Phase 3 | Useful only when Lagos Lands Bureau API integration is in scope |
| `Township` field (LCDA mirror) | Series A | Defer until LCDA is added |
| `MLSAreaMajor` / `MLSAreaMinor` | Series A | Marketplace marketing features |
| `StreetDirPrefix` / `StreetDirSuffix` | Phase 3 | Uncommon in Nigerian addressing |
| Multi-country address support (Verity_GH_*, Verity_KE_*) | Series B | Pan-African expansion |
| What3Words integration for informal settlements | Phase 3 | Tier 4 geocoding for the ~5% of Lagos properties without conventional addresses |
| Address change history visualization | Phase 3 | UI on top of existing `vpid_lineage` data |
| Address quality score | Series A | Per-field confidence aggregation, surfaced as a "Bronze/Silver/Gold" address tier |

The full Phase 2 reconciliation work is documented in detail in **Lagos & FCT Addressing Research v1**.

---

*v1.0 — April 2026 — Initial standalone address capture specification. Sourced from RESO Adoption Brief v1.1, Tech Stack v1.1, CTO Reference v1.1, Frontend Reference v1.1, Designer Reference v1.1, Lagos & FCT Addressing Research v1. Reflects the MVP decision to defer City and Neighborhood reconciliation until market data informs the controlled vocabulary.*