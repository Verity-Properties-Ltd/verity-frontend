import type { Session, SignUpInput } from '@/lib/types/auth';

const SESSION_KEY = 'verity:session';

function persistSession(session: Session) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

export const authService = {
  async signUp(input: SignUpInput): Promise<{ userId: string }> {
    await new Promise((r) => setTimeout(r, 400));
    const userId = `usr_${Math.random().toString(36).slice(2, 10)}`;
    const session: Session = {
      userId,
      fullName: input.fullName,
      email: input.email,
      role: 'buyer',
      createdAt: new Date().toISOString(),
    };
    persistSession(session);
    return { userId };
  },

  async signIn(email: string, _password: string): Promise<{ userId: string }> {
    await new Promise((r) => setTimeout(r, 400));
    const userId = `usr_${Math.random().toString(36).slice(2, 10)}`;
    const inferredName = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Buyer';
    const session: Session = {
      userId,
      fullName: inferredName,
      email,
      role: 'buyer',
      createdAt: new Date().toISOString(),
    };
    persistSession(session);
    return { userId };
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
      // Back-compat: existing sessions written before the role field shipped
      // default to 'buyer'.
      return { ...parsed, role: parsed.role ?? 'buyer' };
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
