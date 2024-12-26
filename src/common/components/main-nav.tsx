'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '~/common/components/icons';
import { ProfileButton } from '~/common/components/profile-button';
import { Button } from '~/common/components/ui/button';
import { Separator } from '~/common/components/ui/separator';
import { cn } from '~/common/helpers/cn';
import { useUserSession } from '~/core/auth/hooks/use-user-session';
import { navConfig } from '~/core/configs/app.config';

type MainNavItemProps = {
  href: string;
  title: string;
  active: boolean;
};

function MainNaveItem({ href, title, active }: MainNavItemProps) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        'inline-flex items-center font-medium text-foreground/60 transition-colors hover:text-foreground/80 md:h-full md:text-background/60 md:hover:text-background/80',
        active && 'text-foreground/80 md:text-background/80',
      )}
    >
      {title}
    </Link>
  );
}

export function MainNav() {
  const pathname = usePathname();
  const { status, hasAdministrativeRights, handleSignOut } = useUserSession();

  const authenticated = status === 'authenticated';

  return (
    <div className="flex flex-1 flex-col gap-4 md:flex-row">
      <div className="flex h-14 items-center">
        <Link href="/">
          <Icons.Logo
            className={cn(
              'h-8 w-auto fill-foreground/60 hover:fill-foreground/80 md:fill-background/60 md:hover:fill-background/80',
            )}
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-4 text-sm font-medium md:flex-row md:items-center">
        {navConfig.main.map(({ href, title }) => {
          return href ? (
            <MainNaveItem
              key={crypto.randomUUID()}
              href={href}
              title={title}
              active={pathname === href}
            />
          ) : null;
        })}
      </nav>

      <Separator className="md:hidden" />

      <nav className="flex flex-1 flex-col justify-end gap-4 text-sm font-medium md:hidden">
        {authenticated ? (
          <>
            {navConfig.user.map(({ href, title }) => {
              return href ? (
                <MainNaveItem
                  key={crypto.randomUUID()}
                  href={href}
                  title={title}
                  active={pathname === href}
                />
              ) : null;
            })}
            {hasAdministrativeRights ? (
              <MainNaveItem
                href="/admin"
                title="Admin"
                active={pathname === '/admin'}
              />
            ) : null}
            <Button size="sm" onClick={handleSignOut}>
              Logout
            </Button>
          </>
        ) : (
          <Button size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </nav>

      <div className="mt-4 hidden flex-1 items-center text-sm md:mt-0 md:flex md:justify-end">
        {authenticated ? (
          <ProfileButton />
        ) : (
          <Link
            href="/login"
            className={cn(
              'text-foreground/60 transition-colors hover:text-foreground/80 md:text-background/60 md:hover:text-background/80',
            )}
            prefetch
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
