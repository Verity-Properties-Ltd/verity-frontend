# @verity/brand/jsx

Two parallel surfaces live here:

- **`*.jsx`** — Drive-canonical sources. Mirror `verity-brand/jsx/*.jsx` (the Google Drive design system folder). Use the global-injection pattern (`Object.assign(window, …)`) and are designed for the HTML showcase, **not** for ES module imports. Sync direction is Drive → repo at design system update time.

- **`*.tsx` + `index.ts`** — Consumable-by-Next-apps port. Each .tsx file mirrors the matching .jsx (keep prop signatures + DOM output in sync) but adds proper ES module exports and TypeScript types. Apps import via `import { Vpid, ConfidenceBand } from '@verity/brand/jsx'`.

## When Drive updates a primitive

1. Re-sync the `.jsx` file from `verity-brand/jsx/`.
2. Diff the changes; if the prop signature or DOM output moved, mirror the change into the matching `.tsx` and bump `index.ts` if exports changed.
3. Trust-critical primitives (Vpid, Vpr, ConfidenceBand, BandDisplay, VerityMark, VerityWordmark) need founder review for any signature change per PRD §11.2.

## Currently ported to .tsx

- `Vpid.tsx` — Vpid, Vpr
- `ConfidenceBand.tsx` — ConfidenceBand, BandDisplay
- `Logo.tsx` — VerityMark, VerityWordmark, VerityLogo
- `Button.tsx` — Button
- `FormField.tsx` — FormField, Input, Textarea, Select, Checkbox, Radio
- `Modal.tsx` — Modal

The remaining .jsx primitives (Alert, Avatar, Badge, Banner, Card, Pagination, Progress, Table, Tabs, Toast, Toggle) port over the same way when an app needs to consume them.
