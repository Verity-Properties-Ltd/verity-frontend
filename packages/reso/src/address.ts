import { NG_STREET_SUFFIXES, type NGStreetSuffix } from './ng-lgas';

/**
 * Naive client-side parser for a combined "Street address" input.
 *
 * Splits "12B Admiralty Way" into { StreetNumber: '12B', StreetName: 'Admiralty', StreetSuffix: 'Way' }.
 *
 * MVP stand-in for Google Places. Best-effort, not authoritative — the
 * server-side parse-or-geocode in the backend is canonical (Address
 * Capture v1 §12). If the parser can't find a number or suffix, it
 * still returns a populated StreetName so submission isn't blocked.
 */
export function parseStreetAddress(input: string): {
  StreetNumber?: string;
  StreetNumberNumeric?: number;
  StreetName?: string;
  StreetSuffix?: NGStreetSuffix;
} {
  const trimmed = input.trim().replace(/\s+/g, ' ');
  if (!trimmed) return {};

  const tokens = trimmed.split(' ');
  let StreetNumber: string | undefined;
  let StreetSuffix: NGStreetSuffix | undefined;
  let nameTokens = tokens.slice();

  // Leading number-like token (handles "12", "12B", "7/4")
  if (nameTokens.length > 1 && /^\d/.test(nameTokens[0]!)) {
    StreetNumber = nameTokens[0];
    nameTokens = nameTokens.slice(1);
  }

  // Trailing suffix (case-insensitive lookup against NG_STREET_SUFFIXES)
  if (nameTokens.length > 1) {
    const last = nameTokens[nameTokens.length - 1]!;
    const match = NG_STREET_SUFFIXES.find((s) => s.toLowerCase() === last.toLowerCase());
    if (match) {
      StreetSuffix = match;
      nameTokens = nameTokens.slice(0, -1);
    }
  }

  const StreetName = nameTokens.join(' ') || undefined;

  let StreetNumberNumeric: number | undefined;
  if (StreetNumber) {
    const m = /^(\d+)/.exec(StreetNumber);
    if (m) StreetNumberNumeric = parseInt(m[1]!, 10);
  }

  return { StreetNumber, StreetNumberNumeric, StreetName, StreetSuffix };
}

/**
 * Compose the RESO `UnparsedAddress` string from parsed components.
 * Mirror of the server-side builder in Address Capture v1 §7.2.
 */
export function buildUnparsedAddress(p: {
  StreetNumber?: string | null;
  StreetName?: string | null;
  StreetSuffix?: string | null;
  UnitNumber?: string | null;
  Verity_NG_PlotNumber?: string | null;
  Verity_NG_Neighborhood?: string | null;
  City?: string | null;
  CountyOrParish?: string | null;
  StateOrProvince?: string | null;
}): string {
  const parts: string[] = [];
  const street = [p.StreetNumber, p.StreetName, p.StreetSuffix].filter(Boolean).join(' ').trim();
  if (street) parts.push(street);
  if (p.UnitNumber) parts.push(`Unit ${p.UnitNumber}`);
  if (p.Verity_NG_PlotNumber) parts.push(p.Verity_NG_PlotNumber);
  if (p.Verity_NG_Neighborhood) parts.push(p.Verity_NG_Neighborhood);
  if (p.City) parts.push(p.City);
  if (p.CountyOrParish) parts.push(`${p.CountyOrParish} LGA`);
  if (p.StateOrProvince) parts.push(p.StateOrProvince);
  return parts.join(', ');
}
