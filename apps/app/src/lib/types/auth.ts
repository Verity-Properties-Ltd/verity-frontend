export type Role = 'buyer' | 'developer' | 'internal';
/** Sub-role within the internal admin shell — assigned by a Super Admin per
 *  UI/UX §7.4. The 'internal' role is the umbrella; SubRole gates the
 *  per-surface route group. */
export type InternalSubRole = 'specialist' | 'ops' | 'admin' | 'registry';

export type SignUpInput = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

export type Session = {
  userId: string;
  fullName: string;
  email: string;
  role: Role;
  /** Present only when role === 'internal'. */
  subRole?: InternalSubRole;
  createdAt: string;
};
