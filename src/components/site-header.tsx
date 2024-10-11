'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSession } from 'next-auth/react';

import { Logo } from '~/components/icons';
import { ProfileButton } from '~/components/profile-button';
import { Button } from '~/components/ui/button';

export function SiteHeader() {
  const pathname = usePathname();
  const { status } = useSession();

  const authenticated = status === 'authenticated';
  const isLoginPage = pathname.includes('/login');

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2">
          <Link href="/">
            <Logo className="h-8 w-auto hover:fill-muted-foreground" />
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {isLoginPage || authenticated ? null : (
            <Button asChild variant="ghost" className="h-8 px-2 py-1.5">
              <Link
                href="/login"
                className="transition-colors hover:text-foreground/80"
                prefetch
              >
                Login
              </Link>
            </Button>
          )}
          {authenticated ? <ProfileButton /> : null}
        </nav>
      </div>
    </header>
  );
}
