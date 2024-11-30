import { redirect } from 'next/navigation';

import { getServerAuthSession } from '~/core/auth/auth.config';
import { LoginForm } from '~/core/auth/components/login-form';

export default async function Page() {
  // TODO: reconsider protecte route with middleware
  const session = await getServerAuthSession();

  if (session) {
    if (!session.user.firstLoginAt) {
      redirect('/change-password');
    }

    redirect('/');
  }

  return <LoginForm />;
}
