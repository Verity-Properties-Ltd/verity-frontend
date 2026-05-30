import { SigninForm } from './SigninForm';
import { SignedInGuard } from '@dev/components/auth/SignedInGuard';

export default function SigninPage() {
  return (
    <SignedInGuard>
      <SigninForm />
    </SignedInGuard>
  );
}
