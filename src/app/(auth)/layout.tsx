import { Suspense } from 'react';
import type { ReactNode } from 'react';

import { ContentContainer } from '~/common/components/content-container';
import { LoadingSpinner } from '~/common/components/loading-spinner';

type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-muted/60 via-muted/30 to-background" />
      <ContentContainer className="relative" size="sm" layout="none">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </ContentContainer>
    </main>
  );
}
