import type { DevSignUpInput, InviteStatus, Session } from '@dev/lib/types/auth';
import { INVITE_REGISTRY } from '@dev/lib/types/auth';

const SESSION_KEY = 'verity:session';

/** Emails that simulate an already-registered account on signup. */
const EXISTING_EMAILS = new Set(['adeola@lekkiheights.ng']);

function persistSession(session: Session) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export class EmailExistsError extends Error {
  constructor() {
    super('An account with this email already exists.');
    this.name = 'EmailExistsError';
  }
}

export const authService = {
  async signUp(input: DevSignUpInput): Promise<{ userId: string }> {
    await new Promise((r) => setTimeout(r, 600));
    if (EXISTING_EMAILS.has(input.email.toLowerCase())) {
      throw new EmailExistsError();
    }
    const userId = `usr_${Math.random().toString(36).slice(2, 10)}`;
    const session: Session = {
      userId,
      fullName: input.fullName,
      email: input.email,
      role: 'developer',
      createdAt: new Date().toISOString(),
    };
    persistSession(session);
    return { userId };
  },

  async signIn(email: string, _password: string): Promise<{ userId: string }> {
    await new Promise((r) => setTimeout(r, 400));
    const userId = `usr_${Math.random().toString(36).slice(2, 10)}`;
    const inferredName = email
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Developer';
    const session: Session = {
      userId,
      fullName: inferredName,
      email,
      role: 'developer',
      createdAt: new Date().toISOString(),
    };
    persistSession(session);
    return { userId };
  },

  async validateInvite(code: string): Promise<InviteStatus> {
    await new Promise((r) => setTimeout(r, 200));
    return INVITE_REGISTRY[code] ?? { kind: 'invalid', ref: code };
  },

  async requestEmailLink(_email: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  },

  getSession(): Session | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Session;
      return { ...parsed, role: parsed.role ?? 'developer' };
    } catch {
      return null;
    }
  },

  signOut(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_KEY);
    }
  },
};
