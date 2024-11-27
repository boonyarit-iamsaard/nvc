import { Suspense } from 'react';

import { VerifyEmail } from '~/core/auth/components/verify-email';

export default async function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="flex min-h-screen flex-col items-center justify-center bg-muted/50">
        <VerifyEmail />
      </section>
    </Suspense>
  );
}
