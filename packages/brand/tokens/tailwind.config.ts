/**
 * Verity — Tailwind theme config
 * Generated from tokens.json. Token consumption is verifiable: every utility
 * class maps to a documented token. Do not introduce arbitrary values.
 *
 * Usage: import preset into tailwind.config.ts → presets: [verityPreset]
 */
import type { Config } from "tailwindcss";

export const verityPreset = {
  theme: {
    // Replace defaults — the system is closed by design.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      navy: { DEFAULT: "#1E2260", deep: "#171A4A", soft: "#2C3078" },
      cream: { DEFAULT: "#F5F2ED", shade: "#EEEAE0" },
      gold: { DEFAULT: "#C9A961", soft: "#E0C994", deep: "#A88A45" },
      slate: { DEFAULT: "#6B6F77", soft: "#9DA1A8" },
      success: "#3A7A5C",
      warning: "#B8862A",
      danger: "#A8302A",
      info: "#3C5A9C",
      // Confidence bands
      band: {
        platinum: "#1E2260",
        gold: "#A88A45",
        silver: "#6B6F77",
        bronze: "#8A6F37",
        provisional: "#B8862A",
        unconfirmed: "#9DA1A8",
        revoked: "#A8302A",
      },
    },
    borderColor: {
      DEFAULT: "rgba(30,34,96,0.12)",
      strong: "rgba(30,34,96,0.22)",
      dark: "rgba(245,242,237,0.14)",
      gold: "#C9A961",
    },
    fontFamily: {
      serif: ["'Cormorant Garamond'", "serif"],
      mono: ["'DM Mono'", "monospace"],
      sans: ["'DM Sans'", "sans-serif"],
      display: ["'Tenor Sans'", "sans-serif"], // wordmark only
    },
    fontSize: {
      "display-1": ["64px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      "display-2": ["48px", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
      h1: ["36px", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      h2: ["28px", { lineHeight: "1.2" }],
      h3: ["22px", { lineHeight: "1.25" }],
      h4: ["18px", { lineHeight: "1.3" }],
      "body-lg": ["18px", { lineHeight: "1.55" }],
      body: ["16px", { lineHeight: "1.6" }],
      "body-sm": ["14px", { lineHeight: "1.55" }],
      caption: ["13px", { lineHeight: "1.5" }],
      tagline: ["20px", { lineHeight: "1.3" }],
      "mono-lg": ["14px", { letterSpacing: "0.04em" }],
      mono: ["11px", { letterSpacing: "0.04em" }],
      eyebrow: ["10px", { letterSpacing: "0.22em" }],
    },
    spacing: {
      0: "0", px: "1px",
      1: "4px", 2: "8px", 3: "12px", 4: "16px",
      6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px",
    },
    borderRadius: {
      none: "0", sm: "3px", DEFAULT: "6px", lg: "10px", full: "999px",
    },
    boxShadow: {
      none: "none",
      raised: "0 4px 14px -6px rgba(30,34,96,0.12)",
      floating: "0 14px 30px -16px rgba(30,34,96,0.18)",
      modal: "0 30px 60px -24px rgba(30,34,96,0.30)",
    },
    transitionTimingFunction: {
      standard: "cubic-bezier(0.2,0.6,0.2,1)",
      out: "cubic-bezier(0.16,1,0.3,1)",
      in: "cubic-bezier(0.5,0,0.75,0)",
    },
    transitionDuration: {
      instant: "80ms", fast: "150ms", base: "200ms",
      slow: "320ms", deliberate: "480ms",
    },
    screens: {
      sm: "480px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
    },
  },
} satisfies Partial<Config>;

export default { presets: [verityPreset], content: [] } satisfies Config;
