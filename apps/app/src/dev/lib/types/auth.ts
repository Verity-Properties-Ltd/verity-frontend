/**
 * Same shape as apps/buyer/src/lib/types/auth.ts — both apps share the
 * same localStorage session key and discriminate on `role`. When we
 * extract a shared auth package later, this becomes the canonical type.
 */

export type Role = 'buyer' | 'developer';

export type Session = {
  userId: string;
  fullName: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type DevSignUpInput = {
  fullName: string;
  email: string;
  companyName: string;
  password: string;
  inviteCode: string;
};

export type InviteStatus =
  | { kind: 'valid'; company: string; admittedAt: string; ref: string }
  | { kind: 'invalid'; ref: string }
  | { kind: 'expired'; ref: string };

/** Hard-coded invite registry for the mock. Replaced by Supabase in Phase 5. */
export const INVITE_REGISTRY: Record<string, InviteStatus> = {
  'INV-LH-7QH3M9': {
    kind: 'valid',
    company: 'Lekki Heights Properties Ltd',
    admittedAt: '28 April',
    ref: 'INV-LH-7QH3M9',
  },
  'INV-LH-EXPIRED-0428': {
    kind: 'expired',
    ref: 'INV-LH-EXPIRED-0428',
  },
};
