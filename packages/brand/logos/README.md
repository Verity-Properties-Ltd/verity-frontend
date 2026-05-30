# VERITY · Logo files

Complete logo package for VERITY Property Technologies. Use these files anywhere
the brand needs to appear — on the web, in print, in slide decks, embedded in
documents.

## What's in here

```
logos/
├── verity-mark.svg                       Shield mark · navy on transparent
├── verity-mark-cream.svg                 Shield mark · cream on transparent (for dark surfaces)
├── verity-wordmark.svg                   Wordmark only · navy + gold "T"
├── verity-wordmark-cream.svg             Wordmark only · cream + gold "T"
├── verity-lockup-horizontal.svg          Mark + wordmark, side-by-side · navy
├── verity-lockup-horizontal-cream.svg    Mark + wordmark, side-by-side · cream
├── verity-lockup-stacked.svg             Mark above wordmark, centred
├── verity-lockup-full.svg                Full lockup with tagline · "the truth behind every title"
├── verity-lockup-full-cream.svg          Full lockup with tagline · cream variant
├── verity-app-icon.svg                   1024×1024 rounded-square app icon · navy ground
└── png/                                  PNG exports of every variant, three sizes each
    ├── verity-mark-{32,128,512}.png
    ├── verity-mark-cream-{32,128,512}.png         (on navy background)
    ├── verity-wordmark-{56,112,224}.png
    ├── verity-wordmark-cream-{56,112,224}.png     (on navy background)
    ├── verity-lockup-horizontal-{60,120,240}.png
    ├── verity-lockup-horizontal-cream-{60,120,240}.png
    ├── verity-lockup-stacked-{130,260,520}.png
    ├── verity-lockup-full-{110,220,440}.png
    ├── verity-lockup-full-cream-{110,220,440}.png
    └── verity-app-icon-{256,512,1024}.png
```

PNG files are exported at 2× density so they're crisp on retina displays and
fine for print at moderate sizes.

## Which file to use, when

| Use case | Pick this |
|---|---|
| Favicon, app icon, social profile | `verity-app-icon.svg` (1024×1024) |
| Sticky header / top-of-page brand | `verity-lockup-horizontal.svg` |
| Footer brand / inline brand mention | `verity-lockup-horizontal.svg` at small size, or `verity-mark.svg` alone |
| Hero panel, masthead, deck cover | `verity-lockup-stacked.svg` or `verity-lockup-full.svg` |
| Certificate, document letterhead | `verity-lockup-full.svg` (includes tagline) |
| Watermark / icon-only contexts | `verity-mark.svg` |
| On a dark surface (navy, deep gradient) | use the `*-cream.svg` variant |

## Rules of the road

The full system is documented in `verity_brand_system.html`. The short list:

1. **Two colours.** The mark is navy `#1E2260` (or cream `#F5F2ED` on dark) with the gold corner-tick at `#C9A961`. Don't recolour.
2. **The "T" is always gold.** In the wordmark, only the "T" is `#C9A961`. The rest matches the mark colour.
3. **Don't stretch, rotate, skew, add effects, or place on busy backgrounds.** Refer to the "don'ts" section in the brand system.
4. **Minimum size.** Mark: 16px on screen, 5mm in print. Below that the gold corner-tick disappears — switch to the wordmark or full lockup.
5. **Clear-space.** Reserve at least the width of the gold corner-tick on every side of the mark.

## Tokens

| Token | Hex |
|---|---|
| `--navy` | `#1E2260` |
| `--cream` | `#F5F2ED` |
| `--gold` | `#C9A961` |
| `--gold-deep` | `#A88A45` |

## Type

The wordmark is set in **Tenor Sans**, regular weight, +0.06em tracking. The
tagline in `verity-lockup-full.svg` is set in **Cormorant Garamond**, italic,
medium weight.

The SVGs set type with **presentation attributes** (`font-family`, `font-size`,
`letter-spacing`) directly on each `<text>` — not a `<style>` block — so the
wordmark spacing is correct everywhere, including as `<img>` and offline. The
wordmark calls for **Tenor Sans** and the tagline for **Cormorant Garamond**
italic, each with a fallback stack; install those fonts for exact letterforms,
or just use the **PNG exports**, which have both fonts baked in and are
pixel-perfect at deployment.

---

Verity Property Technologies Ltd. · Lagos · 2026
