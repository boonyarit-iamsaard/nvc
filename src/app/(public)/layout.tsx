import type { ReactNode } from 'react';

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
      <main className="flex-1">{children}</main>
    </>
  );
}
