import type { ReactNode } from 'react';

import { ContentContainer } from '~/common/components/content-container';

type BookingsLayoutProps = {
  children: ReactNode;
};

export default function BookingsLayout({
  children,
}: Readonly<BookingsLayoutProps>) {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-muted/60 via-muted/30 to-background" />
      <ContentContainer className="relative" layout="header">
        {children}
      </ContentContainer>
    </div>
  );
}
