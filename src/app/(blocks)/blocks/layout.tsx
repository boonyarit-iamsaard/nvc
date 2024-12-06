import type { ReactNode } from 'react';

import { SiteHeader } from '~/common/components/site-header';

type BlockLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function BlockLayout({ children }: BlockLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
