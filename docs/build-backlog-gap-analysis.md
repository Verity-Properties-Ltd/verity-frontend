# Build Backlog Gap Analysis — Buyer + Developer Flows

**Snapshot date:** 2026-05-30
**Scope:** `apps/app/src/app/buyer/*` and `apps/app/src/app/developer/*` measured against the 16 BUY-* and 10 DEV-* stories in the [VERITY Build Backlog](https://app.notion.com/p/102f472f1bd742308da6bec987bdadf6).
**Method:** read each story's acceptance criteria, compare against the implementation. Status legend below.

| Legend | Meaning |
|---|---|
| ✅ Done | Implementation substantially meets the acceptance criteria. |
| 🟡 Partial | Surface exists; key sub-criteria missing or stubbed. |
| ❌ Not started | No code for this story. |
| ⚠️ Overlap | Built differently than spec (URL drift, scope drift, etc.). |

---

## Buyer flow (16 stories)

| Story | Status | Notes |
|---|---|---|
| **BUY-01** Submit a property via guided flow | 🟡 Partial | 5-step wizard at `/buyer/request/new/*` works end-to-end against mocks. Gaps: per-file document-type selector ([#7](https://github.com/Verity-Properties-Ltd/verity-dashboard/issues/7)), GPS capture ([#8](https://github.com/Verity-Properties-Ltd/verity-dashboard/issues/8)), "I don't have any documents yet" Bronze-ceiling path. |
| **BUY-02** Autosave in-progress submission | 🟡 Partial | `useRequestDraft` autosaves to localStorage. Not surfaced as resumable drafts on the buyer Home — separate History page lists past requests instead. 30-day auto-purge not enforced. |
| **BUY-03** Live status + ETA | ✅ Done | `/buyer/requests/[id]` + `StatusHead` + `InProgressView` cover the spec. Verify 8-stage gold/ink visual treatment matches UI/UX v1.3 §4.5. |
| **BUY-04** Completed report verdict | 🟡 Partial | `CompleteView` + `/certificate` render band + score + evidence. Missing the one-line plain-language declaration under the band (*"The title is confirmed at the registry…"*). |
| **BUY-05** Download PDF + secure share | 🟡 Partial | Public URL + share modal exist. **No PDF generation** (server-side ≤30s p95 not wired). No QR code render. |
| **BUY-06** Action Needed alert | 🟡 Partial | `AwaitingView` component exists for the detail page. Missing: pinned alert on Home, primary-action button, "SLA clock paused" visual, WhatsApp/email notification (FND-13 absent). |
| **BUY-07** Standard vs Premium picker | ✅ Done | `/buyer/request/new/tier/page.tsx` two-card picker at correct ₦50k / ₦150k pricing. |
| **BUY-08** Payment history + invoices | 🟡 Partial | Account page exists; payment-history section is a stub. No invoice PDF generation. |
| **BUY-09** Buyer Home — list of all requests | ⚠️ Overlap | Spec calls for ONE prioritized feed (Action Needed → In Progress → Drafts → Completed) on `/buyer`. Built as TWO surfaces: `/buyer` (dashboard with CTA) + `/buyer/history` (past requests). Needs reconciliation into a single feed. |
| **BUY-10** Pay via Paystack | 🟡 Partial | `/buyer/request/new/payment` UI step is a placeholder. **No Paystack SDK wired** — depends on FND-09 spike. |
| **BUY-11** Confirmation + WhatsApp + email | 🟡 Partial | Screen rendered (`ConfirmedSummary`). No transactional WhatsApp/email — FND-13 plumbing absent. |
| **BUY-12** Distribute (WhatsApp share + email lawyer) | 🟡 Partial | Generic `ShareModal` exists; missing dedicated "WhatsApp share intent" + "Email lawyer" `mailto:` actions. |
| **BUY-13** Account & profile settings | 🟡 Partial | `AccountClient` shell exists. Missing email-change confirmation flow, notification-preference toggles, data export/deletion. |
| **BUY-14** Resubmit or cancel a request | ❌ Not started | No overflow-menu actions on `RequestDetailClient`. |
| **BUY-15** Saved payment methods | ❌ Not started | Blocked by BUY-10 (real Paystack). |
| **BUY-16** Multi-property bulk diaspora | ❌ Not started | Post-M3 scope — intentionally deferred. |

## Developer flow (10 stories)

| Story | Status | Notes |
|---|---|---|
| **DEV-01** Group properties into portfolio groupings | 🟡 Partial | Built has a flat portfolio table; **no groupings entity** in the data model, no `/developer/portfolios` (plural) surface. The "loose-tag a property into multiple portfolios" affordance is the structural gap. |
| **DEV-02** Bulk-order verification | 🟡 Partial | CSV upload + row-level ok/warn/dup validation at `/developer/portfolio/add/csv`. Gaps: spec URL is `/developer/bulk-order`, downloadable template not exposed, title-type column ([#7](https://github.com/Verity-Properties-Ltd/verity-dashboard/issues/7)). |
| **DEV-03** Portfolio overview across groupings | 🟡 Partial | `VerifiedDashboard` at `/developer` shows cross-portfolio KPIs + bands. Blocked from full completeness by DEV-01 (no groupings concept yet). |
| **DEV-04** Invite team members | 🟡 Partial | Team section visible in Account. Invite-email flow + magic link (FND-13) + role enforcement absent. |
| **DEV-05** Co-branded share link | 🟡 Partial | `/developer/distribute` exists with 5 formats incl. badge. Missing: `?cb=developer_slug` query param on public URL, `/developer/branding` setup (logo, colour), co-brand badge render on `apps/public-page`. |
| **DEV-06** Searchable library of completed reports | ⚠️ Overlap | Spec URL `/developer/library`; built at `/developer/portfolio`. Same data, different URL. Full-text search may be filters-only (verify). |
| **DEV-07** Subscription usage + manage plan | 🟡 Partial | Founding Card in Account shows cohort status. Dedicated `/developer/plan` surface + non-cohort tier picker absent. |
| **DEV-08** Developer Home | ✅ Done | `VerifiedDashboard` at `/developer` covers it (4 `KpiCard`s, band breakdown, attention list, activity feed, quick actions). Verify the four named tiles match the spec exactly. |
| **DEV-09** Single verification detail (dev view) | ⚠️ Overlap | Spec URL `/developer/verification/{vpid}`; built at `/developer/portfolio/[vpid]`. Same content, different URL. Phase 3 Verification panel covers the analyst-output sections. Action-Needed strip missing. |
| **DEV-10** Respond to Action Needed | ❌ Not started | No `/developer/action-needed` surface. No detail-page handling for the analyst-to-developer or analyst-to-buyer-with-developer-in-loop scenarios. |

---

## Cross-cutting gaps + overlaps

### Blocked by foundation stories

These can't fully complete until the matching Foundation sprint lands:

- **FND-09** (Paystack sandbox) blocks BUY-10, BUY-11, BUY-15
- **FND-13** (Email + WhatsApp transactional plumbing) blocks BUY-06, BUY-11, BUY-12, DEV-04, DEV-10
- **PDF generation infrastructure** blocks BUY-05 and the public-page certificate export

### URL drift (built ≠ canonical spec URL — needs reconciliation)

| Built URL | Spec URL | Story |
|---|---|---|
| `/developer/portfolio/[vpid]` | `/developer/verification/{vpid}` | DEV-09 |
| `/developer/portfolio` | `/developer/library` | DEV-06 |
| `/developer/portfolio/add/csv` | `/developer/bulk-order` | DEV-02 |
| `/buyer` + `/buyer/history` (two surfaces) | `/buyer` (one unified feed) | BUY-09 |

### Structural gaps (data model, not just UI)

- **Portfolio groupings** (DEV-01) — currently flat list; need a `Grouping` entity + many-to-many to `Property` + UI surfaces. Blocks DEV-03 from full completion.
- **Action Needed flow** (BUY-06, DEV-10) — needs a `Verification.status = awaiting_buyer` state machine + SLA-pause logic + cross-surface alert plumbing.
- **Real auth** (every story) — both flows use mock sessions; real auth blocks BUY-13 email change, DEV-04 invites, and anything signed by a specific user.

### Coverage score (substantially done)

| Flow | Done | Partial | Not started | Overlap | ~UI completeness |
|---|---|---|---|---|---|
| Buyer | 2 / 16 | 11 / 16 | 3 / 16 | 1 / 16 | ~50% |
| Developer | 1 / 10 | 7 / 10 | 1 / 10 | 1 / 10 | ~50% |

The bulk of remaining work is **backend wiring** (Paystack, email/WhatsApp, PDF gen, real auth) + **two structural pieces** (portfolio groupings + Action Needed state machine). UI scaffolds are largely in place.

---

## Refresh cadence

This document is a **point-in-time snapshot** of 2026-05-30. Re-run the analysis when:

- A Foundation sprint story lands (FND-09, FND-13, FND-15, FND-16 are the highest-leverage)
- A BUY-* or DEV-* story is closed in the backlog (re-check its status here)
- The URL-drift items get reconciled (update the table)

The canonical backlog state lives in [Notion](https://app.notion.com/p/102f472f1bd742308da6bec987bdadf6); this file is a derivative view kept in-repo so engineers can scan it during planning without a Notion roundtrip.
