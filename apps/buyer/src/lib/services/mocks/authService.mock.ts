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
      return JSON.parse(raw) as Session;
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
