import type { ReactNode } from 'react';

import { SiteHeader } from '~/common/components/site-header';

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default function ProtectedLayout({
  children,
}: Readonly<ProtectedLayoutProps>) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </>
  );
}
