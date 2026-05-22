import { SignupForm } from './SignupForm';
import { SignedInGuard } from '@/components/auth/SignedInGuard';

export default function SignupPage() {
  return (
    <SignedInGuard>
      <SignupForm />
    </SignedInGuard>
  );
}
