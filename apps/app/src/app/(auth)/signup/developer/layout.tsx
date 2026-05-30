import { DevAuthShell } from '@dev/components/auth/DevAuthShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DevAuthShell>{children}</DevAuthShell>;
}
