# Verity Developer Dashboard — Build Plan

## Context

The buyer flow ships (issues #1, #3 track remaining work). The repo now needs a parallel `apps/developer/` for the **other side** of every verification: the property seller. A developer is a Nigerian real-estate company (e.g. "Lekki Heights Properties Ltd") that owns inventory and uses Verity to push verifications across their portfolio. Buyer pulls verifications on a single property; developer pushes them on many. **Same VPID, different role-scoped view.**

Reference: `reference/developer-dashboard/` (22 design-draft files, ~5,800 lines, mobile and desktop split per screen).

## Stack (decided)

- Next.js 15 App Router + TypeScript in `apps/developer/`
- `@verity/brand` tokens shared with buyer
- No Tailwind — port `dev*.css` files via media queries (collapse the mobile/desktop file split)
- Mocked services first behind the same seam pattern as `apps/buyer/src/lib/services/`
- **Unified auth, role discriminator** — both apps read/write the same `verity:session` localStorage key; `Session` gets a `role: 'buyer' | 'developer'` field
- **Shared fixtures** — extract buyer's seed data into a new `packages/fixtures/` workspace consumed by both apps
- **Mono KYC mocked** in Phase 1 (real SDK lands with the Supabase swap, issue #1)
- **Atom strategy:** duplicate from `apps/buyer/src/components/` per-app for now; revisit `packages/ui` extraction after both apps are running

## Glossary (from the design drafts)

- **Portfolio** — full holdings table with filter/sort/bulk-refresh
- **Property** — single VPID detail (tabs: overview / history / distribution / edit)
- **Add** — 5-step submission wizard (type → docs → ref → tier → review), with Single / Batch-25 / CSV-import modes
- **Distribute** — "revenue surface": URL / PDF / HTML embed / QR / Founding-Partner badge formats
- **Shells** — *not a screen* — `dev-mobile-shells.jsx` holds mobile chrome (DvmShell wrappers, app bar, bottom tabs)

## Route map (all under `apps/developer/src/app/`)

| Draft | Route | Auth |
|---|---|---|
| `DevSignup` (4 states) | `/(auth)/signup` (`?invite=`) | public |
| `SignupVerificationSent` | `/(auth)/signup/check-email` | public |
| `SignupInvalidInvite` | `/(auth)/signup/invalid` | public |
| (sign-in, mirrors buyer) | `/(auth)/signin` | public |
| `DevDashboardOnboarding` + `DevDashboard` | `/(dev)/dashboard` (state-driven on `kycState`) | auth |
| `MonoProveModal` | `/(dev)/dashboard/@modal/(.)kyc/prove` (parallel route) | auth |
| `DevPortfolio` / `Empty` | `/(dev)/portfolio` | auth |
| `DevPropertyDetail` | `/(dev)/portfolio/[vpid]` (tab via `?tab=`) | auth |
| `DevAddProperty` (5 steps) | `/(dev)/portfolio/add/[step]` | auth |
| `DevBulkCsv` | `/(dev)/portfolio/add/csv` | auth |
| `DevDistribute` | `/(dev)/distribute` (optional `?vpid=`) | auth |
| `DevAccount` | `/(dev)/account` | auth |

## Phasing

### Phase 0 — Workspace prep + developer scaffold

**Buyer-side refactors (touches shipped code):**
- Add `role: 'buyer' | 'developer'` to `apps/buyer/src/lib/types/auth.ts:Session`; existing sessions default to `'buyer'`
- `apps/buyer/src/app/(buyer)/AuthGuard.tsx` checks `session?.role === 'buyer'`; bounces a developer to `/dev/dashboard` instead of `/signup`
- Create `packages/fixtures/` workspace (`@verity/fixtures`); move buyer's 4 seed records out of `apps/buyer/src/lib/services/mocks/requestService.mock.ts`
- Buyer mock services re-import seeds from `@verity/fixtures`

**Developer scaffold:**
- `apps/developer/` via create-next-app pattern (App Router, TS, no Tailwind)
- `tsconfig.json` aliases `@/*` → `src/*`, `@verity/brand/*` → `packages/brand/*`, `@verity/fixtures/*` → `packages/fixtures/*`
- Root layout imports `@verity/brand/tokens/index.css`
- Port `dev.css` + `dev-mobile.css` → `apps/developer/src/app/(dev)/dev.css` (merged via media queries)
- Port `dev-auth.css` → `apps/developer/src/app/(auth)/auth.css`
- Add `dev:developer` script to root `package.json`

**Exit criteria:** `npm run dev:developer` boots a blank page with brand tokens applied; existing buyer flow still works end-to-end (regression check via the manual smoke test from buyer plan).

**Commit:** `feat(infra): unify auth, extract shared fixtures, scaffold developer app`

### Phase 1 — Auth shell + onboarding (signup → KYC → verified)

- `(auth)/layout.tsx` with cohort-aware split aside; collapses to single column under `lg:`
- `/signup` form with state machine (`default` / `filled` / `submitting` / `email_exists` / `invalid_invite`) wired to `authService.signUp({ fullName, email, companyName, password, inviteCode })` (writes session with `role: 'developer'`)
- `/signup/check-email` + `/signup/invalid` static
- `/signin` mirrors buyer
- `(dev)/layout.tsx` with `AuthGuard` (port from buyer, scoped to `role === 'developer'`), `DevRail`, `DevTopbar`
- `/dashboard` renders `DevDashboardOnboarding` while `kycState` cycles through `pending_kyc` → `stage1` → `stage2` → `verified` (mock auto-progresses on a 15s timer)
- `MonoProveModal` parallel route — pure UI simulation of the hosted widget
- Atoms extracted: `VerityMarkCream` (new — cream-on-navy variant); reuse `VerityMark`, `Brand` from buyer (duplicate-copy)

**Exit criteria:** signup → check-email → sign-in → dashboard cycles through KYC states; Prove modal opens; refresh keeps session.

### Phase 2 — Dashboard + portfolio

- `/dashboard` post-KYC renderer: KPI grid, band-breakdown bar, distribution sparkline, attention items, recent activity, quick actions
- `/portfolio` table with filter chips, bulk-action bar (selection-driven), pagination
- `DevPortfolioEmpty` when `propertyService.list()` returns `[]`
- Atoms: `BandPill` + `BAND_LABELS`, `StatusPill`, `KpiCard`, `BandBreakdownBar`, `AttentionItem`, `ActivityFeed`, `ActivityItem`, `FilterChip`, `BulkBar`, `PortfolioTable`

**Exit criteria:** dashboard renders with mock data; portfolio toggles empty ↔ populated based on seed; bulk-select updates count.

### Phase 3 — Property detail + Add wizard

- `/portfolio/[vpid]` hero + tab strip (Overview / History / Distribution / Edit); `VerificationHistory`, `DistributionLog`, `SalesMetadataCard`, `PublicUrlCard`
- `/portfolio/add/[step]` 5-step wizard mirroring buyer's `request/new`; `WizardRail` with cohort-pricing card; `useAddPropertyDraft()` over sessionStorage
- `/portfolio/add/csv` upload + parsed-row table with `ok` / `warn` / `dup` validation badges
- Wires `propertyService.{createDraft, submit, parseCsv, refresh, archive}`

**Exit criteria:** walk all 5 steps including file uploads → land on detail page with fabricated VPID; CSV import shows 18 rows with mixed validation.

### Phase 4 — Distribute + account

- `/distribute` formats grid (URL / PDF / Embed / QR / Founding-Partner badge); property-scope picker
- Row-level distribute sheet via `@sheet` parallel route on portfolio
- `/account` sections: company profile, team, subscription
- Wires `distributionService.*`, `accountService.*`, `teamService.*`

**Exit criteria:** copy URL, download PDF stub, copy embed snippet, view QR; account edits persist to localStorage.

(No Phase 5 — Supabase swap is one cross-app change tracked in issue #1.)

## Service-layer seam

Same pattern as buyer (`services/index.ts` re-exports active impl; mocks in `services/mocks/`; types in `lib/types/`). All under `apps/developer/src/lib/services/`.

```
authService.{signUp, validateInvite, signIn, getSession, signOut}   // unified storage, role='developer'
kycService.{getStatus, startStage1, openProveSession}
propertyService.{list, get, createDraft, submit, parseCsv, refresh, archive}
verificationService.history(vpid)
distributionService.{log, getFormats, bulkZip}
accountService.{getProfile, updateProfile}
teamService.{list, invite}
```

**Cross-app coupling:** `propertyService.get(vpid)` and buyer's `requestService.get(vpid)` resolve the same VPID with different shape projections. Shared seed data lives in `packages/fixtures/`; each app's mock projects it differently.

## Shared atoms — reuse vs new

| Source | Atom | Strategy |
|---|---|---|
| buyer | `VerityMark`, `Brand` | duplicate-copy to `apps/developer/src/components/brand/` |
| new | `VerityMarkCream` | new cream-on-navy variant for the dark rail |
| buyer | form primitives | duplicate-copy; map class names `bf-*` → `dv-*` at copy time |
| buyer | `BandPill` | duplicate-copy with 6 bands (Platinum/Gold/Silver/Bronze/Provisional/Unconfirmed) |
| new | `DevRail`, `DevTopbar`, `DevBottomTabs` | dev-specific (Workspace + Account sections, property count badge) |
| new | `PageHead` (dev variant), `DevWizardRail` (vertical with cohort-pricing slot) | dev-specific |
| new | `KpiCard`, `BandBreakdownBar`, `AttentionItem`, `FilterChip`, `BulkBar`, `PortfolioTable`, `StatusPill`, `Pager` | dashboard + portfolio |
| new | `PropertyHero`, `VerificationHistory`, `DistributionLog`, `SalesMetadataCard`, `PublicUrlCard`, `TabStrip` | property detail |
| new | `WizardModeToggle`, `DocumentSlotCard`, `CsvPreviewTable` | add wizard |
| new | `FormatCard`, `BadgeLockupPreview` | distribute |
| new | `KvRow`, `TeamMemberRow`, `MonoProveModal` | account + KYC |

## Critical files (read these to execute)

- `reference/developer-dashboard/dev-shell.jsx` — `DevRail`, `DevTopbar`, `PageHead`, `BandPill`, `VerityMarkCream`
- `reference/developer-dashboard/dev-onboarding.jsx` — full `kycState` machine + `MonoProveModal`
- `reference/developer-dashboard/dev-portfolio.jsx` + `dev-property.jsx` — data model and table/detail layouts
- `reference/developer-dashboard/dev.css` (1,569 lines) + `dev-mobile.css` (1,655 lines) — port to one merged stylesheet
- `apps/buyer/src/app/(buyer)/layout.tsx` + `apps/buyer/src/lib/services/mocks/authService.mock.ts` — pattern to mirror

## Decisions confirmed

- **Auth:** unified with role discriminator (Phase 0 touches buyer to add the field)
- **Mono KYC:** mock-only in Phase 1; real SDK in Phase 5 (issue #1 scope)
- **Fixtures:** extract to `packages/fixtures/` in Phase 0 (Phase 0 touches buyer to consume from the new package)

## Open clarifications (handle inline during implementation)

- **Invite codes:** mock at least one valid (`INV-LH-7QH3M9`) and one expired (`INV-LH-EXPIRED-0428`) in `authService.validateInvite()`
- **Activity feed:** aggregate from `verificationService` + `distributionService` + `accountService` client-side; no unified `activityService`
- **CSV import:** Phase 3 stops at parsing + validation (`propertyService.parseCsv` returns mock results); ingestion is a stub
- **Host / subdomain:** out of scope; both apps deploy to their own dev port for now

## Verification

Per-phase exit criteria are listed above. Overall acceptance:

1. Buyer flow regression: clean signup → submit → status → certificate → share still works after Phase 0 buyer-side refactors
2. Developer flow: signup → KYC cycle → add property → property detail → distribute end-to-end on mocks
3. Shared VPIDs surface correctly in both apps (a buyer hitting `/v/[vpid]` and a developer viewing `/portfolio/[vpid]` see consistent metadata)
4. Cross-role bounce works (developer hitting `/dashboard` in buyer app bounces to dev dashboard, and vice versa)
