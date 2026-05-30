import { SigninForm } from './SigninForm';
import { SignedInGuard } from '@/components/auth/SignedInGuard';

export default function SigninPage() {
  return (
    <SignedInGuard>
      <SigninForm />
    </SignedInGuard>
  );
}
