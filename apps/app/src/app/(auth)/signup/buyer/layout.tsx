import { BuyerAuthShell } from '@/components/auth/BuyerAuthShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BuyerAuthShell>{children}</BuyerAuthShell>;
}
