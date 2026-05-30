/**
 * Canonical Verity design-system primitives — proper ES module exports.
 *
 * The .jsx files under this directory are the original HTML-showcase
 * versions (global-injection pattern); the .tsx files here are the
 * consumable-by-Next-apps port. When a primitive needs to be used inside
 * an app, port it to .tsx with proper TypeScript typing and re-export
 * from here.
 *
 * Trust-critical primitives (PRD §11.2 — founder-review required to change):
 *   Vpid, Vpr, ConfidenceBand, BandDisplay, VerityMark, VerityWordmark.
 */

export { Vpid, Vpr } from './Vpid';
export type { VpidProps } from './Vpid';

export { ConfidenceBand, BandDisplay } from './ConfidenceBand';
export type { Band, ConfidenceBandProps, BandDisplayProps } from './ConfidenceBand';

export { VerityMark, VerityWordmark, VerityLogo } from './Logo';
export type { VerityMarkProps, VerityWordmarkProps, VerityLogoProps } from './Logo';

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export {
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
} from './FormField';
export type {
  FormFieldProps,
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
} from './FormField';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';
