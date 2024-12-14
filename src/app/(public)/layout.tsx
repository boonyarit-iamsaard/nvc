import { Suspense } from 'react';
import type { ReactNode } from 'react';

import { LoadingSpinner } from '~/common/components/loading-spinner';
import { SiteHeader } from '~/common/components/site-header';

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({
  children,
}: Readonly<PublicLayoutProps>) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </main>
    </>
  );
}
