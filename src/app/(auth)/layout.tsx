import { Suspense } from 'react';
import type { ReactNode } from 'react';

import { Loading } from './loading';

type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex-1">
      <section className="container py-16 md:py-24 lg:py-32">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </section>
    </main>
  );
}
