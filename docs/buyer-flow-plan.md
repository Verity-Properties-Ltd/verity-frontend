# Verity Buyer Flow — Build Plan

## Context

The repo currently holds design drafts only: a brand system (`verity-brand/`), landing-page HTML, and a single-file React gallery (`screens/buyer-flow/buyer-flow.jsx`, 1229 lines) that renders 13 buyer-side screens × 4 viewports as a Figma-style canvas. There is no package.json, no router, no backend.

The goal is to turn the gallery into a real, navigable Next.js app that buyers can click through end-to-end, with all backend calls behind a service-layer seam so a real Supabase implementation can be dropped in later without touching screens.

This plan covers the **buyer flow only**. The developer dashboard (`screens/developer-dashboard/`) is parallel work and out of scope here, but the repo layout below anticipates it.

## Stack (decided)

- Next.js 15 (App Router) + TypeScript + pnpm workspaces
- No Tailwind — port the existing `bf-*` CSS, keep design tokens as CSS custom properties
- No real backend in Phases 1–4; mocked services in Phase 1, Supabase in Phase 5 (separate planning)
- Auth simulated via `localStorage` so `(buyer)` routes persist across refresh

## Repo layout

```
verity-dashboard/
├── apps/
│   ├── buyer/                 # NEW — Next.js App Router + TS
│   └── developer/             # placeholder (empty)
├── packages/
│   └── brand/                 # = current verity-brand/ (moved)
├── reference/
│   ├── buyer-flow/            # = current screens/buyer-flow/ (moved, untouched)
│   └── landing/               # = current verity_*.html (moved)
├── docs/
│   └── buyer-flow-plan.md     # copy of this plan
├── pnpm-workspace.yaml
└── package.json
```

`packages/brand` exposes `./tokens/index.css` and `./logos/*.svg`. The `jsx/*` UMD components are NOT importable from Next (Babel-in-browser, window-globals, different class-name convention) — kept as visual reference only.

## Route map

All under `apps/buyer/src/app/`. `(auth)` and `(buyer)` are route groups for layout segregation.

| Gallery component | Route | Auth |
|---|---|---|
| `ScreenSignup` | `/(auth)/signup` | public |
| `ScreenEmailSent` | `/(auth)/signup/check-email` | public |
| `ScreenRequestProperty` | `/(buyer)/request/new/property` | auth |
| `ScreenRequestDocs` | `/(buyer)/request/new/documents` | auth |
| `ScreenRequestTier` | `/(buyer)/request/new/tier` | auth |
| `ScreenRequestPayment` | `/(buyer)/request/new/payment` | auth |
| `ScreenRequestConfirmed` | `/(buyer)/request/new/confirmed` | auth |
| `ScreenBuyerDashboard` | `/(buyer)/dashboard` | auth |
| `ScreenStatusInProgress` | `/(buyer)/requests/[id]` (state-driven) | auth |
| `ScreenStatusAwaiting` | same route, awaiting state | auth |
| `ScreenStatusComplete` | same route, complete state | auth |
| `ScreenCertificate` | `/(buyer)/requests/[id]/certificate` | auth |
| `ScreenDistribute` | `/(buyer)/requests/[id]/@modal/(.)share` | auth |

`/(buyer)/requests/[id]` is one route that switches renderers on `verification.status`. Share is a parallel-route modal intercepting over the certificate.

Public `verity.properties/v/[vpid]` cert page is deferred — not in any phase.

## Phasing

Each phase is independently mergeable and demo-able.

**Phase 0 — Workspace foundation**
- Create `pnpm-workspace.yaml`, move `verity-brand/` → `packages/brand/`, move `screens/` → `reference/`, move `verity_*.html` → `reference/landing/`
- Scaffold `apps/buyer` via `create-next-app` (App Router, TS, no Tailwind, no ESLint default)
- `tsconfig.json` path aliases: `@verity/brand/*` → `packages/brand/*`, `@/*` → `apps/buyer/src/*`
- Root `app/layout.tsx` imports `@verity/brand/tokens/index.css`
- Copy this plan to `docs/buyer-flow-plan.md`
- **Exit criteria:** `pnpm dev` boots a blank Next page with brand tokens applied

**Phase 1 — Auth shell + signup**
- `(auth)/layout.tsx` renders split marketing aside (visible `lg:`, hidden below)
- `/signup` form → `authService.signUp(input)` mock → `localStorage.setItem('verity:session', ...)` → router push `/signup/check-email`
- `/signup/check-email` static
- Extract atoms: `VerityMark`, `Brand`
- Port `auth-*` CSS from `screens/buyer-flow/styles.css` → `apps/buyer/src/app/(auth)/auth.css`
- **Exit criteria:** click through signup → check-email, refresh keeps session

**Phase 2 — Request wizard (5 steps)**
- `(buyer)/layout.tsx` — responsive nav: `BuyerTabs` bottom-bar on mobile, `DesktopRail` aside on `lg:`
- Auth guard placeholder in `(buyer)/layout.tsx` reads `localStorage.getItem('verity:session')`, redirects to `/signup` if absent
- `request/new/layout.tsx` hosts `StepBar` + sticky CTA footer + `RequestSidebar` (desktop)
- 5 step routes (property / documents / tier / payment / confirmed)
- `useRequestDraft()` hook backed by `sessionStorage` accumulates form state across steps
- Documents step: real file picker + drag-drop, `URL.createObjectURL` preview, `File[]` held in draft state; `requestService.submit()` mock logs filenames and discards
- Tier step: persists `'standard' | 'premium'` choice on draft
- Final step posts draft → mock returns fabricated `vpid` → push `confirmed`
- **Exit criteria:** walk all 5 steps, attach 2 files, see them in confirmed-summary

**Phase 3 — Dashboard + status**
- `/dashboard` → `requestService.list()` → renders active + past request rows
- `/requests/[id]` → `requestService.get(id)` → switches between `<InProgressView>`, `<AwaitingView>`, `<CompleteView>`
- `StatusTrack` accepts a `tier` prop; for `'standard'` it marks stages 3, 6, 7 as `skipped` (greyed, no pip animation, "Not included in Standard" microcopy)
- Mock data covers all 3 states via three seed ids: `vpr-in-progress`, `vpr-awaiting`, `vpr-complete`
- Extract: `StatusTrack`, `BandPill`, `BandBlock`, `ActiveRequestRow`, `VERIFICATION_STAGES` constant
- **Exit criteria:** dashboard → click each seed → see correct status renderer; Standard request shows 3 skipped stages

**Phase 4 — Certificate + share**
- `/requests/[id]/certificate` extracts `CertMasthead`, `CertProperty`, `CertSign`, `CertFoot`
- `@modal/(.)share` parallel route intercepts `/requests/[id]/share`, renders modal (desktop) / bottom-sheet (mobile) via media query
- `shareService.email(vpid, recipient)` mock; WhatsApp is a `wa.me/` `<a href>` only
- **Exit criteria:** view cert, open share sheet, "send" calls mock and closes

**Phase 5 — Supabase swap** (separate planning effort, not detailed here)
- Replace each `services/mocks/*.ts` with a real impl, edit only `services/index.ts` to switch the wiring
- Add `middleware.ts` for real auth
- Schema, RLS, migrations: separate plan

## Service-layer seam

All under `apps/buyer/src/lib/services/`. One file per domain. Types in `apps/buyer/src/lib/types/`. Mocks in `services/mocks/`. Single `services/index.ts` re-exports the active implementation.

```
authService.signUp(input: SignUpInput): Promise<{ userId: string }>
authService.requestEmailLink(email: string): Promise<void>
authService.getSession(): Session | null

requestService.createDraft(): RequestDraft
requestService.submit(draft: RequestDraft): Promise<{ vpid: string }>
requestService.list(): Promise<RequestSummary[]>
requestService.get(vpid: string): Promise<RequestDetail>

verificationService.getTrack(vpid: string): Promise<{
  currentStage: number;
  completedDates: Record<number, string>;
  skipped: number[];  // stages skipped due to Standard tier
}>

certificateService.get(vpid: string): Promise<Certificate>
shareService.email(vpid: string, recipient: string): Promise<void>
```

Phase 5 only touches `services/index.ts` + adds real impls. Screens never import from `mocks/` directly.

## Shared components to extract

From `screens/buyer-flow/buyer-flow.jsx` (gallery is the visual source of truth, do not modify it) into `apps/buyer/src/components/`:

- **`brand/`** — `VerityMark`, `Brand`
- **`chrome/`** — `AppBar`, `BuyerTabs`, `DesktopRail` (`DesktopShell` becomes `(buyer)/layout.tsx`)
- **`wizard/`** — `StepBar`, `PageHead`, `RequestSidebar`
- **`verification/`** — `BandPill`, `BandBlock`, `StatusTrack` + `VERIFICATION_STAGES`
- **`dashboard/`** — `ActiveRequestRow`
- **`certificate/`** — `CertMasthead`, `CertProperty`, `CertSign`, `CertFoot`, `TierCards`
- **`forms/`** — typed `Input`, `Field`, `Segmented`, `Upload`, `PaymentForm`, `OrderSummary` (ports `bf-input` / `bf-field` patterns)

**Drop** (gallery scaffolding): `PhoneFrame`, `TabletFrame`, `DesktopFrame`, `FrameCard`, `App`.

CSS porting: `bf-*` rules → `apps/buyer/src/app/(buyer)/buyer.css`, imported once in `(buyer)/layout.tsx`. `auth-*` rules → `(auth)/auth.css`. Token import stays global in root layout.

## Responsiveness

Collapse the `vp` prop branches into CSS media queries. Only two screens diverge structurally:
- **Auth** — desktop split (marketing + form), mobile single-column. Handled by hiding the aside under `lg:` in `(auth)/layout.tsx`.
- **Share** — desktop centered modal, mobile bottom sheet. One component, media-queried chrome.

Everything else collapses cleanly into one responsive tree.

## Critical files for execution

**Read (source of truth):**
- `/Users/lifeofladi/dev/verity-dashboard/screens/buyer-flow/buyer-flow.jsx`
- `/Users/lifeofladi/dev/verity-dashboard/screens/buyer-flow/styles.css`
- `/Users/lifeofladi/dev/verity-dashboard/screens/buyer-flow/responsive.css`
- `/Users/lifeofladi/dev/verity-dashboard/verity-brand/tokens/index.css`
- `/Users/lifeofladi/dev/verity-dashboard/verity-brand/tokens/components.css`

**Create:**
- `pnpm-workspace.yaml`, root `package.json`
- `apps/buyer/` (full Next.js scaffold)
- `packages/brand/package.json` (rename / add)
- `docs/buyer-flow-plan.md` (copy of this plan)

**Move (git mv):**
- `verity-brand/` → `packages/brand/`
- `screens/` → `reference/`
- `verity_*.html` → `reference/landing/`

## Verification

Per-phase exit criteria are listed in the Phasing section. Overall acceptance:

1. `pnpm install && pnpm --filter buyer dev` boots without errors
2. Visit `/signup`, complete form, land on `/signup/check-email`, refresh → still signed in
3. Visit `/dashboard`, "New request", walk all 5 steps including file attach, land on confirmed page
4. Visit each of the 3 seed request ids, confirm correct status renderer; the `standard`-tier seed shows 3 stages as skipped
5. Visit `/requests/[id]/certificate`, open share, "send" closes the sheet
6. Hard-refresh any route — auth guard either keeps you in or bounces you to `/signup`
7. Resize browser from 375px → 1440px — no layout breaks on any screen

No automated tests in this plan — defer test/CI setup until after the screens work.
