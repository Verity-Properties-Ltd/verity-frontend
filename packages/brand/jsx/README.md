# @verity/brand/jsx

Two parallel surfaces live here:

- **`*.jsx`** — original Drive showcase sources. Use the global-injection pattern (`Object.assign(window, …)`) and are designed for browser-Babel HTML showcase, **not** for ES module imports. Kept for reference + occasional designer-side previewing.

- **`*.tsx` + `index.ts`** — Consumable-by-Next-apps port. Each .tsx file mirrors the matching .jsx (keep prop signatures + DOM output in sync) but adds proper ES module exports and TypeScript types. Apps import via `import { Vpid, ConfidenceBand } from '@verity/brand/jsx'`.

## When a primitive changes

1. Edit the `.tsx` (the consumable). Apps + Storybook pick up the change immediately.
2. Mirror the change into the matching `.jsx` if you want the HTML showcase to stay in sync.
3. Trust-critical primitives (Vpid, Vpr, ConfidenceBand, BandDisplay, VerityMark, VerityWordmark) need founder review for any signature change per PRD §11.2.

## Currently ported to .tsx

- `Vpid.tsx` — Vpid, Vpr
- `ConfidenceBand.tsx` — ConfidenceBand, BandDisplay
- `Logo.tsx` — VerityMark, VerityWordmark, VerityLogo
- `Button.tsx` — Button
- `FormField.tsx` — FormField, Input, Textarea, Select, Checkbox, Radio
- `Modal.tsx` — Modal

The remaining .jsx primitives (Alert, Avatar, Badge, Banner, Card, Pagination, Progress, Table, Tabs, Toast, Toggle) port over the same way when an app needs to consume them.
