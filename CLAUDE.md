# Verity monorepo — engineering guide

Notion is the single source of truth for what to build. Four canonical documents:

- **PRD v2.1** — what to build, in what order, with what success criteria. https://app.notion.com/p/VERITY-Product-Requirements-Document-v2-1-36ffea3e5fa78182b51fc456b3bb2fa6
- **UI/UX Architecture v1.3** — companion to PRD; IA, navigation, sitemap, URL structure. https://app.notion.com/p/VERITY-Phase-1-UI-UX-Architecture-v1-3-36ffea3e5fa781c89562f846d733bec2
- **Design System & Brand Assets** — vendored canonically in `packages/brand/` (tokens, jsx, logos). Notion page mirrors the standards for reference: https://app.notion.com/p/Design-System-Brand-Assets-36cfea3e5fa7817cbde2eadc6093653a
- **VERITY Build Backlog** — 104 user stories. https://app.notion.com/p/102f472f1bd742308da6bec987bdadf6

PRD §How-to-read defines the document-vs-code governance rule: when this codebase and the PRD disagree, **the codebase is source of truth for current behaviour**, and the PRD must be updated with a dated Change Notice. The one exception is identifier formats (PRD §4.2 VPID Base-36 + Luhn, §4.3 VPR-YYYY-NNNNNN) — those are canonical in the PRD and the code must conform.

## Repo layout

```
apps/
├── landing/     verity.properties — single-page teaser (Phase 2; LND-T-00a–d done)
├── app/         app.verity.properties — authenticated shell
│   └── src/app/
│       ├── (auth)/signin/{buyer,developer}/ + signup/{buyer,developer}/
│       ├── buyer/                  UI/UX §4 — diaspora buyer journey
│       ├── developer/              UI/UX §5 — Founding 50 portfolio
│       └── internal/               UI/UX §7 — specialist · ops · admin · registry (Phase 4 scaffolds)
├── public-page/ verity.properties/v/{VPID} — share-safe certificate (UI/UX §6)
└── api/         FastAPI backend (Python) — vendored via git subtree from Verity-Properties-Ltd/verity-backend

packages/
├── brand/       design tokens (CSS) exported as @verity/brand
├── fixtures/    shared fixture data exported as @verity/fixtures
└── reso/        RESO Data Dictionary v2.0 types + 774 NG LGAs as @verity/reso

docs/            design-system-standards.md (voice / banned patterns / governance)
                 RESO implementation specs live in Notion (see source-of-truth links above)

reference/landing-expansion/   raw mvp components for the LND-EXP-* backlog
```

## URL structure (UI/UX §2.1 / §2.2)

Three subdomains:
- `verity.properties` → apps/landing
- `verity.properties/v/{VPID}` → apps/public-page (hosted on apex)
- `app.verity.properties` → apps/app

Authenticated routes inside apps/app:
- `/buyer`, `/buyer/account`, `/buyer/history`, `/buyer/request/new/{property,documents,tier,payment,confirmed}`, `/buyer/requests/[id]`, `/buyer/requests/[id]/certificate`
- `/developer`, `/developer/account`, `/developer/distribute`, `/developer/portfolio`, `/developer/portfolio/add/{type,csv,documents,review}`, `/developer/portfolio/[vpid]`, `/developer/kyc/prove`
- `/internal/{specialist,ops,admin,registry}` and sub-routes
- `/signin/{buyer,developer}`, `/signup/{buyer,developer}` (UI/UX §2.5 unification → Phase 6 polish)

## tsconfig path aliases

- `@/*` → `src/*` (buyer-side + shared)
- `@dev/*` → `src/dev/*` (developer-side namespaced)

The buyer routes import from `@/components/*` and `@/lib/*`; the developer routes import from `@dev/components/*` and `@dev/lib/*`. Shared types (auth, session) live under `@/lib/types/`. The split exists because 11 component paths (Brand, SignedInGuard, wizard/*) diverge between surfaces (different CSS class prefixes — `bf-*` for buyer, `dv-*` for developer). A future shared-component extraction can collapse the namespace.

## Dev scripts

```
npm run dev:landing    # port 3000
npm run dev:app        # port 3001
npm run dev:public     # port 3002
npm run dev:storybook  # port 6006
npm run dev:api        # port 8001 — docker compose up (postgres + redis + mongo + localstack + api + worker)
npm run dev:api:down   # tear it down
npm run test:api       # pytest in apps/api/
npm run logs:api       # tail api + worker logs
```

Build scripts: `build:landing`, `build:app`, `build:public`, `build:storybook`.

## Design system discipline (PRD §11.3)

Five locked rules:
1. **One gold per surface.** Gold is signal — never two gold CTAs in one frame.
2. **No gradients, no shadows except true overlays** (modal, toast).
3. **No exclamation marks in product UI.** Evidence, never opinion.
4. **No emoji in product-route string literals.** DM Mono glyphs, gold rule, or labelled state instead.
5. **Tenor Sans is reserved for the wordmark.** Cormorant for display/body, DM Mono for identifiers (VPID, VPR), DM Sans for rare UI utility.

Banned patterns enforced by CI lint when wired (post-consolidation):
- Off-token colour / font-size / spacing / radius literals (must come from `packages/brand/tokens/`).
- `linear-gradient` / `radial-gradient` outside `.seal`.
- `box-shadow` on non-overlay selectors.
- Tenor Sans usage outside the wordmark.
- Emoji or exclamation marks in product-route string literals.

Exceptions need an inline `/* verity-allow: <rule> — <reason> */` and an owner's review.

Domain primitives (PRD §11.2) are trust-critical — changes require founder review, not routine design review:
- **VPID Display** — `VRT-XXXXXXXXX` per §4.2. Always DM Mono.
- **VPR Display** — `VPR-YYYY-NNNNNN` per §4.3. Always DM Mono.
- **Confidence Band** — six-band ladder (Platinum / Gold / Silver / Bronze / Provisional / Unconfirmed) plus Revoked / Expired state overlays per §4.4.

Voice (UI/UX §3.6 hybrid model):
- **"We" voice on marketing surfaces** (landing, blog, press, social, founder bios). Warm, first-person.
- **Institutional voice inside the product** (buyer dashboard, developer dashboard, certificate, public verification page, internal admin console, API docs, transactional emails). Restrained, evidence-led, no "we".

## Backend — `apps/api/`

FastAPI service, vendored via `git subtree` from `Verity-Properties-Ltd/verity-backend`. Backend stack (FND-01 Option A — Python/FastAPI) per PRD §7.1.

Stack: FastAPI · SQLAlchemy + Alembic · Postgres · Redis · MongoDB · `arq` background workers · JWT (RS256) · bcrypt · S3 (LocalStack in dev) · Docker Compose.

Layout (inside `apps/api/`):
- `app/main.py` — FastAPI entry; registers middleware + `/api/v1` router + startup health checks
- `app/api/v1/` — versioned route handlers (auth, users, companies, properties, documents, orders, reports, verifications, admin, health)
- `app/services/` — business-logic layer. **Route handlers stay thin and call services.**
- `app/models/` — SQLAlchemy models
- `app/schemas/` — Pydantic request / response schemas (the API contract)
- `app/core/` — config, db, security, redis, mongo, session store
- `app/workers/` — `arq` workers (OCR, report compilation, email)
- `alembic/` — Postgres migrations
- `tests/` — async API tests (pytest)
- `SYSTEM_OVERVIEW.md` — comprehensive arch + every endpoint's contract

Run locally: `npm run dev:api` (brings up the full stack on port 8001). Health check: `curl http://localhost:8001/api/v1/health`.

When backend changes upstream: `cd apps/api && git subtree pull --prefix=apps/api https://github.com/Verity-Properties-Ltd/verity-backend.git main --squash`. Frontend dev keeps working against mock services regardless of backend state.

## Mock service seams

The authenticated-side services are mocked behind a clean interface:
- `apps/app/src/lib/services/index.ts` — buyer-side (authService, requestService, certificateService, shareService)
- `apps/app/src/dev/lib/services/index.ts` — developer-side (authService, propertyService, distributionService, kycService, accountService)
- `apps/public-page/src/lib/services/index.ts` — public-side (certificateService only)

The mock seams stay as the test + offline-dev path even after the backend wires in. Per-story BUY-* / DEV-* work swaps each mock to a real HTTP impl pointing at `localhost:8001/api/v1/` in dev.

## Local LocalStorage keys (mock services)

- `verity:session` — auth session shape. Role discriminator routes the AuthGuard.
- `verity:requests` — buyer request drafts.
- `verity:dev-portfolio-empty` — toggles developer empty-state mock.
- `verity:add-property-drafts:v1` — developer add-property wizard drafts.

These go away when Supabase / FastAPI is wired.
