import { SignupForm } from './SignupForm';
import { SignedInGuard } from '@/components/auth/SignedInGuard';

type Search = { invite?: string };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { invite } = await searchParams;
  return (
    <SignedInGuard>
      <SignupForm initialInvite={invite} />
    </SignedInGuard>
  );
}
