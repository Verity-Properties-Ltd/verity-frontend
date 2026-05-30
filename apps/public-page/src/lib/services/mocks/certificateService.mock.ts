import type { Certificate } from '@/lib/types/certificate';
import { VERIFICATION_SEEDS } from '@verity/fixtures';

const SEEDS = VERIFICATION_SEEDS;

function fmtVerifiedDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase();
}

/** Public verification-page certificate lookup. Reads the same fixture seeds
 *  that the authenticated buyer-side certificate uses, but strips any
 *  street-level data per Address Capture v1 §13 (city + LGA + state only). */
export const certificateService = {
  async get(vpid: string): Promise<Certificate | null> {
    await new Promise((r) => setTimeout(r, 80));
    const seed = SEEDS.find((s) => s.vpid === vpid);
    if (!seed || seed.status !== 'complete' || !seed.band) return null;
    const verifiedIso = seed.expectedAt || seed.createdAt;
    return {
      vpid,
      publicUrl: `verity.properties/v/${vpid.toUpperCase()}`,
      property: {
        City: seed.property.City ?? seed.city,
        CountyOrParish: seed.property.CountyOrParish ?? seed.property.lga,
        StateOrProvince: seed.property.StateOrProvince ?? 'Lagos',
        PostalCode: seed.property.PostalCode,
        Verity_NG_Neighborhood: seed.property.Verity_NG_Neighborhood,
        PropertyType: seed.property.PropertyType,
        PropertySubType: seed.property.PropertySubType,
        StandardStatus: 'Active',
        Verity_LGA: seed.property.CountyOrParish ?? seed.property.lga,
        sizeSqm: seed.property.sizeSqm,
      },
      verifiedAt: fmtVerifiedDate(verifiedIso),
      band: seed.band,
      specialist: {
        name: seed.tier === 'standard' ? 'Verity Document Desk' : 'Ifeoma Okafor',
        title:
          seed.tier === 'standard'
            ? 'Document & Registry Specialist'
            : 'Licensed Estate Surveyor & Valuer',
        regNo:
          seed.tier === 'standard' ? 'VERITY DESK · 0042' : 'NIESV REG. NO. 4892',
        signedAt: fmtVerifiedDate(verifiedIso),
      },
      tier: seed.tier,
    };
  },
};
