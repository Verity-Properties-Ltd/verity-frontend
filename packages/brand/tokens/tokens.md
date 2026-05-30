# Verity — Design Tokens Specification

The single source of truth for every value in the Verity verification platform.
Machine-readable mirror: [`tokens.json`](./tokens.json) · Tailwind preset: [`tailwind.config.ts`](./tailwind.config.ts) · CSS variables: [`index.css`](./index.css)

> **Token discipline.** The system is *closed*. No arbitrary colours, sizes, or
> radii. If a value isn't in this file, it doesn't ship. New tokens go through
> governance (see [`../docs/design-system-standards.md`](../docs/design-system-standards.md)).

---

## Colour

### Brand
| Token | Hex | Role |
|---|---|---|
| `--navy` | `#1E2260` | Anchor — primary brand, text, solid fills |
| `--navy-deep` | `#171A4A` | Elevation — dark surfaces, toasts |
| `--navy-soft` | `#2C3078` | Hover/active step on navy |
| `--cream` | `#F5F2ED` | Ground — default page background |
| `--cream-shade` | `#EEEAE0` | Surface — raised panels, fills |
| `--gold` | `#C9A961` | **Signal — one per surface only** |
| `--gold-soft` | `#E0C994` | Gold on dark grounds |
| `--gold-deep` | `#A88A45` | Italic copy, gold text on light |
| `--slate` | `#6B6F77` | Meta, secondary text |
| `--slate-soft` | `#9DA1A8` | Disabled, placeholder |

### Lines
`--line` `rgba(30,34,96,.12)` · `--line-strong` `rgba(30,34,96,.22)` · `--line-dark` `rgba(245,242,237,.14)`

### Semantic
`--success` `#3A7A5C` · `--warning` `#B8862A` · `--danger` `#A8302A` · `--info` `#3C5A9C`

### Confidence bands (descending ladder)
| Band | Anchor colour | Treatment |
|---|---|---|
| Platinum | `#1E2260` | solid navy fill · gold dot · cream text |
| Gold | `#A88A45` | gold tint |
| Silver | `#6B6F77` | slate tint |
| Bronze | `#8A6F37` | bronze tint |
| Provisional | `#B8862A` | amber tint |
| Unconfirmed | `#9DA1A8` | neutral outline |
| *Revoked* (state) | `#A8302A` | danger tint |
| *Expired* (state) | `#9DA1A8` | muted 70% |

---

## Type ramp

Four families, each with a locked job:
- **Cormorant Garamond** (`--f-serif`) — headings, body, tagline. Roman is the meal; italic is the spice (tagline + ≤3-word emphasis only).
- **DM Mono** (`--f-mono`) — identifiers, meta, eyebrows, VPID/VPR.
- **DM Sans** (`--f-sans`) — rare UI utility.
- **Tenor Sans** (`--f-display`) — **wordmark only.** Never body or UI.

| Token | Size | Notes |
|---|---|---|
| `--t-display-1` | 64px | serif 500, −0.02em |
| `--t-display-2` | 48px | serif 500, −0.015em |
| `--t-h1` … `--t-h4` | 36 / 28 / 22 / 18px | serif 600 |
| `--t-body-lg` / `body` / `body-sm` | 18 / 16 / 14px | serif 400 |
| `--t-caption` | 13px | serif, slate |
| `--t-tagline` | 20px | serif italic 500, gold-deep |
| `--t-mono-lg` / `mono` | 14 / 11px | DM Mono, +.04em |
| `--t-eyebrow` | 10px | DM Mono, +.22em, uppercase, gold-deep |

---

## Spacing — 4px base

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96` → `--s-1 … --s-24`

## Radius

`0 · 3px · 6px · 10px · 999px` → `--r-0 --r-1 --r-2 --r-3 --r-full`
Containers cap at 10px; pills use full. Data table cells: `--r-0`.

## Elevation

| Token | Value | Use |
|---|---|---|
| `--shadow-flat` | `none` | **default** — shadows banned except overlays |
| `--shadow-raised` | `0 4px 14px -6px …` | sparing |
| `--shadow-floating` | `0 14px 30px -16px …` | toasts |
| `--shadow-modal` | `0 30px 60px -24px …` | modal overlays only |

## Motion

Durations `--motion-instant 80ms` · `fast 150ms` · `base 200ms` · `slow 320ms` · `deliberate 480ms`
Easing `--ease-standard` · `--ease-out` · `--ease-in`. Honours `prefers-reduced-motion`.

## Breakpoints (min-width)

`--bp-sm 480` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`
Mobile-first for buyers; desktop-primary for developers.
