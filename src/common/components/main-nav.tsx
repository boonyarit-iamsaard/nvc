'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSession } from 'next-auth/react';

import { Icons } from '~/common/components/icons';
import { ProfileButton } from '~/common/components/profile-button';
import { cn } from '~/common/helpers/cn';
import { mainNav } from '~/core/configs/links';

export function MainNav() {
  const pathname = usePathname();
  const { status } = useSession();

  const authenticated = status === 'authenticated';
  const isLoginPage = pathname.includes('/login');

  return (
    <div className="hidden md:flex md:flex-1 md:gap-4">
      <Link href="/public">
        <Icons.Logo className="h-8 w-auto hover:fill-muted-foreground" />
      </Link>
      <nav className="flex items-center gap-4 text-sm font-medium">
        {mainNav.map(({ href, title }) => {
          return href ? (
            <Link
              key={href}
              href={href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === href ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              {title}
            </Link>
          ) : null;
        })}
      </nav>
      <div className="flex flex-1 items-center justify-end text-sm">
        {isLoginPage || authenticated ? null : (
          <Link
            href="/login"
            className="transition-colors hover:text-foreground/80"
            prefetch
          >
            Login
          </Link>
        )}
        {authenticated ? <ProfileButton /> : null}
      </div>
    </div>
  );
}
