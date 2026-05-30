# Verity — Design System Standards

The written rules behind the Verity verification platform: how the brand speaks,
what the system refuses, and how it stays coherent as the team grows.

**Contents**
1. [Voice & Tone](#1--voice--tone)
2. [Banned Patterns](#2--banned-patterns)
3. [Governance](#3--governance)

> **Why this is strict.** *Trust is the product.* Diaspora buyers wiring six
> figures need to feel institutional infrastructure, not a startup. Restraint
> reads as credibility; flourish reads as risk.

---

# 1 · Voice & Tone

Verity sells trust. The writing is the trust signal as much as the design is.
The voice is **institutional, precise, and quietly confident** — a registrar,
not a marketer.

## The hybrid voice rule

Verity speaks in two registers depending on surface:

| Context | Register | Pronoun | Example |
|---|---|---|---|
| **Marketing** (verity.properties, landing, emails) | Warm, plain, first-person | **"we"** | "We verify a Lagos property before you wire money." |
| **Product** (app, certificate, public page) | Neutral, institutional, declarative | **no "we"** where avoidable | "Confirmed against the Lagos State Land Registry." |

Inside the product, the system states facts; it does not chat. The certificate
never says "we think" — it says what was verified and who signed off.

## Principles

1. **Evidence, never opinion.** We report what was checked and confirmed. We never say a property is "safe" or "a good buy."
2. **No exclamation marks in product UI.** Ever. A full stop carries more authority.
3. **Plain over clever.** No "seamless", "revolutionary", "unlock", "supercharge". Say the specific thing.
4. **Identifiers are sacred and exact.** VPID, VPR, registry references, dates — always DM Mono, never paraphrased, never truncated in a way that loses meaning.
5. **Calm under uncertainty.** Expired, pending, and flagged states are stated plainly without alarm or reassurance theatre.
6. **Italic is a scalpel.** The tagline, and ≤3-word emphasis, only.

## Tone decision tree

- **Is this a verification result or identifier?** → Neutral, declarative, no first person. *"Verified to Gold confidence. Score 82."*
- **Is this guiding the user through an action?** → Helpful, direct, second person. *"Upload the C of O and any supporting deeds."*
- **Is this an error?** → Plain cause + the fix, no blame. *"Enter an 8-character folio, e.g. 0xA9F2."*
- **Is this marketing?** → Warm "we", still no hype. *"We verify before you wire."*

## Copy examples — good vs. bad

| Surface | ✅ Good | ❌ Bad |
|---|---|---|
| **CTA** | "Start a verification" · "Continue to payment" | "Get verified now!" · "Unlock peace of mind 🚀" |
| **Error** | "Enter a valid Nigerian phone number — e.g. 0801XXXXXXX." | "Invalid input." · "Oops! Something went wrong 😬" |
| **Success** | "Verified. The credential is anchored, signed, and unbroken." | "Success! You're all set! 🎉" |
| **Notification** | "Title VRT-7QH3M9XKR has a new ledger entry." | "Great news — there's an update on your property!!" |
| **Status** | "In verification — stage 4 of 8. Expected by 6 May 2026." | "Hang tight, we're working hard on it!" |
| **Empty** | "Everything's in good standing." | "Nothing here yet — add something to get started!" |
| **Flag** | "The registered survey predates the 2021 cadastral re-baseline; coordinates accepted as filed, not re-measured." | "Minor issue detected, but don't worry!" |

**The read-aloud test:** read the copy in the voice of a property registrar
signing an official document. If it sounds like a salesperson, a chatbot, or a
cheerleader, rewrite it.

---

# 2 · Banned Patterns

Hard rules. A surface that violates one is off-brand, regardless of how good it
otherwise looks. Lint rules and design review (§3) enforce them.

## Visual

| # | Banned | Instead |
|---|---|---|
| 1 | **Gradients** of any kind — backgrounds, fills, text, borders. | Flat brand colours. The only permitted gradient is the ≤10%-opacity radial *inside the gold seal*. |
| 2 | **Drop shadows on flat surfaces** (cards, buttons, inputs, table rows). | `--shadow-flat` (none). Shadows are allowed **only** on true overlays: `--shadow-modal`, `--shadow-floating` (toasts). |
| 3 | **Emoji in product UI.** | DM Mono glyphs, the gold rule, or a labelled state. |
| 4 | **More than one gold element per surface.** Gold is signal. | One gold accent. If two things compete for gold, neither gets it. |
| 5 | **Tenor Sans anywhere but the wordmark.** | Cormorant for display/body, DM Mono for identifiers. |
| 6 | **Italic for body copy.** | Italic = tagline and ≤3-word emphasis, always `--gold-deep`. |
| 7 | **Pure black (`#000`) or pure white page grounds.** | `--navy` / `--cream`. White is for input fields and cards only. |
| 8 | **Saturated, off-palette colour.** No teal, purple, hot accents. | The closed token set. New colours go through governance. |
| 9 | **Decorative iconography / illustration** as trust signals. | Evidence, references, the seal, the specialist signature. |
| 10 | **Full-radius "pill" buttons.** Pills are for bands, badges, tags only. | Buttons use `--r-1` (3px). |

## Interaction & motion

| # | Banned | Instead |
|---|---|---|
| 11 | **Floating / disappearing form labels.** | Labels sit above their field, always visible. |
| 12 | **On-submit-only validation.** | Inline validation as the user leaves each field. |
| 13 | **Bouncy, springy, attention-seeking animation.** | `--ease-standard`, durations ≤320ms. Calm, not energetic. |
| 14 | **Auto-playing motion, carousels, parallax.** | Static. Motion only confirms a user action. |
| 15 | **Anxiety-inducing live tickers** on status pages. | Calm stage indicators; "Expected by [date]". |

## Copy

| # | Banned | Instead |
|---|---|---|
| 16 | **Exclamation marks in product UI.** | A full stop. Always. |
| 17 | **Opinions about a property** ("this is safe to buy"). | Evidence: "these specific things were verified." |
| 18 | **Marketing clichés** — "seamless", "revolutionary", "game-changing", "unlock". | Plain, specific, institutional language. |
| 19 | **Blame copy in errors** ("Invalid input"). | Guidance: "Enter an 8-character folio, e.g. 0xA9F2." |
| 20 | **"No flags raised" as displayed text.** | Omit the flags section entirely when there are none. |

**The one-line test:** read a surface as a Tier-1 bank's risk officer. If
anything feels *energetic, salesy, or uncertain*, it fails. Calm, evidenced, signed.

---

# 3 · Governance

How the system changes, who decides, and how the rules are enforced in code.

## Ownership

| Area | Owner | Role |
|---|---|---|
| Design system (tokens, components, patterns) | **Adebayo Adeyemi** — Senior Product Designer | Final say on visual + interaction spec |
| Front-end implementation | **Boniface Ukanwa** — Senior Frontend Engineer | Owns component code, Storybook, lint rules |
| Brand (logo, voice, naming) | **Founders** (Sheun Badmus, Oladipo Awolaja) | Approve brand-level changes |
| Accessibility & compliance | Design + Eng jointly | WCAG AA, NDPR copy review |

A change is "done" only when design and engineering both sign off.

## What lives where

- **Source of truth for tokens** — [`../tokens/tokens.json`](../tokens/tokens.json). CSS variables, the Tailwind preset, and this documentation are all derived from it. Change the JSON first.
- **Component code** — `../jsx/*.jsx` + `../tokens/components.css` + `../tokens/patterns.css`.
- **Storybook** — `storybook.verity.internal` (internal). Every primitive has a story with all states. A component without a story is not shippable.
- **Documentation** — this file + `../tokens/tokens.md`.
- **Rendered reference** — `../tokens-at-a-glance.html` and `../index.html`.

## Adding or changing a primitive

1. **Propose.** Open a design-system issue: the need, and why an existing primitive can't cover it. One primitive per issue.
2. **Token check.** A value not already in `tokens.json` must be justified and added to the JSON in the same change — never hard-coded in a component.
3. **Design review.** Adebayo reviews against the four principles and the banned-patterns list. Confidence-band, VPID, and VPR primitives additionally require founder review (trust-critical meaning).
4. **Build + story.** Boniface implements; ships with a Storybook story covering default / hover / active / focus / disabled (and any domain states).
5. **Lint passes** (below).
6. **Merge.** Two approvals: one design, one engineering.

> Changes to the **wordmark, the gold T, the confidence-band scale, or the
> certificate layout** are brand-level and require founder approval — not routine
> component changes.

## Lint enforcement

Enforced in CI, not by goodwill. The Verity ESLint + Stylelint config fails the build on:

- **Off-token values** — any colour, font-size, spacing, or radius literal that isn't a token.
- **Banned properties** — `linear-gradient` / `radial-gradient` (allow-listed only on `.seal`); `box-shadow` on non-overlay selectors.
- **Tenor Sans misuse** — `--f-display` outside `.t-wordmark` / logo files.
- **Emoji** in product-route string literals.
- **Exclamation marks** in product copy files (warning-level; marketing exempt).

A red build blocks merge. Exceptions need an inline `/* verity-allow: <rule> — <reason> */` and an owner's review.

## Versioning

The package is versioned (`tokens.json#version`). Token changes bump **minor**; a
breaking rename or removal bumps **major** with a migration note. Consumers pin a
version; brand-level changes are announced before release.
