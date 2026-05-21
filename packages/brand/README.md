# Verity — Brand Package

A complete, production-ready brand and UI system for Verity.

```
verity-brand/
├── README.md                  ← this file
├── index.html                 ← visual showcase of every asset
├── logos/                     ← SVG master files
│   ├── verity-mark.svg
│   ├── verity-mark-cream.svg
│   ├── verity-wordmark.svg
│   ├── verity-wordmark-cream.svg
│   ├── verity-lockup-horizontal.svg
│   ├── verity-lockup-horizontal-cream.svg
│   ├── verity-lockup-stacked.svg
│   ├── verity-lockup-full.svg
│   ├── verity-lockup-full-cream.svg
│   └── verity-app-icon.svg
├── tokens/                    ← CSS design tokens
│   ├── tokens.css             (CSS custom properties)
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   ├── components.css         (button, form, badge, alert, card, etc.)
│   └── index.css              (imports all)
└── jsx/                       ← React components (UMD-friendly)
    ├── Button.jsx
    ├── Badge.jsx
    ├── Tag.jsx
    ├── Alert.jsx
    ├── Card.jsx
    ├── Avatar.jsx
    ├── FormField.jsx
    ├── Toggle.jsx
    ├── Tabs.jsx
    ├── Pagination.jsx
    ├── Logo.jsx
    └── index.jsx              (exports all to window)
```

## Quick start

### 1. Tokens only (HTML / vanilla CSS)
```html
<link rel="stylesheet" href="tokens/index.css">
<button class="btn btn-primary">Verify a title</button>
```

### 2. With React components (no bundler — Babel-in-browser)
```html
<link rel="stylesheet" href="tokens/index.css">
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
<script type="text/babel" src="jsx/Button.jsx"></script>
<script type="text/babel" src="jsx/index.jsx"></script>
<script type="text/babel">
  const { Button, Badge, Alert } = window;
  // ...
</script>
```

## The locked rules (do not violate)

1. **One gold per surface.** Gold is signal — never two gold CTAs in the same frame.
2. **Italic only for the tagline + ≤3-word emphasis.** Roman is the meal, italic is the spice.
3. **Tenor Sans is reserved for the wordmark.** Never use it for body or UI.
4. **Mark minimum size:** 16px screen, 5mm print. Below that, the gold corner-tick disappears.
5. **Clear-space:** reserve the width of the gold tick on all sides of the mark.

## Color tokens at a glance

| Role        | Token             | Value     |
|-------------|-------------------|-----------|
| Anchor      | `--navy`          | `#1E2260` |
| Elevation   | `--navy-deep`     | `#171A4A` |
| Ground      | `--cream`         | `#F5F2ED` |
| Surface     | `--cream-shade`   | `#EEEAE0` |
| Signal      | `--gold`          | `#C9A961` |
| Italic copy | `--gold-deep`     | `#A88A45` |
| Meta        | `--slate`         | `#6B6F77` |

## Type stack

- **Wordmark** — Tenor Sans 400, +60 tracking
- **Headings + body** — Cormorant Garamond Roman 400–700
- **Tagline + rare emphasis** — Cormorant Garamond Italic 500
- **Numerals + meta** — DM Mono 300–500

— *the truth behind every title.*
