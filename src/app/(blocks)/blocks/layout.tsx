import type { ReactNode } from 'react';

import { SiteHeader } from '~/common/components/site-header';

type BlockLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function BlockLayout({ children }: BlockLayoutProps) {
  return (
    <>
      <SiteHeader enableHeaderTransition={false} />
      <main className="flex-1">
        <div className="relative pt-14">
          <div className="absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-muted/80 via-muted/40 to-background" />
          {children}
        </div>
      </main>
    </>
  );
}
