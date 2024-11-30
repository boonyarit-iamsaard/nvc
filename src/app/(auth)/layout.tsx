import { Suspense } from 'react';
import type { ReactNode } from 'react';

type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex-1">
        <section className="container py-16 md:py-24 lg:py-32">
          {children}
        </section>
      </main>
    </Suspense>
  );
}
