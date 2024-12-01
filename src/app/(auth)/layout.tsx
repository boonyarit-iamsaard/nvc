import { Suspense } from 'react';
import type { ReactNode } from 'react';

import { Loading } from './loading';

type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-muted/60 via-muted/30 to-background" />
      <section className="container relative py-16 md:py-24 lg:py-32">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </section>
    </main>
  );
}
