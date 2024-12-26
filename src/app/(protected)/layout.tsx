import type { ReactNode } from 'react';
import Link from 'next/link';

import { ContentContainer } from '~/common/components/content-container';
import { Message } from '~/common/components/message';
import { SiteHeader } from '~/common/components/site-header';
import { Button } from '~/common/components/ui/button';
import { getServerAuthSession } from '~/core/auth/auth.config';

type ProtectedLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await getServerAuthSession();

  return (
    <>
      <SiteHeader enableHeaderTransition={false} />
      <main className="flex-1">
        <div className="relative pt-14">
          <div className="absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-muted/80 via-muted/40 to-background" />
          <ContentContainer layout="header" size="lg" className="relative">
            {session ? (
              children
            ) : (
              <Message
                variant="warning"
                title="Access Restricted"
                message="You need to be logged in to access this page"
              >
                <div className="grid gap-3 sm:grid-cols-6">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="sm:col-span-2 sm:col-start-2"
                  >
                    <Link href="/">Return Home</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="sm:col-span-2 sm:col-start-4"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </Message>
            )}
          </ContentContainer>
        </div>
      </main>
    </>
  );
}
