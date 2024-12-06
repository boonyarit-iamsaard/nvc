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

export function MainNav() {
  const pathname = usePathname();
  const { status, hasAdministrativeRights, handleSignOut } = useUserSession();

  const authenticated = status === 'authenticated';
  const isLoginPage = pathname.includes('/login');

  return (
    <div className="flex flex-1 flex-col gap-4 md:flex-row">
      <div className="flex h-14 items-center">
        <Link href="/">
          <Icons.Logo className="h-8 w-auto hover:fill-muted-foreground" />
        </Link>
      </div>

      <nav className="flex flex-col gap-4 text-sm font-medium md:flex-row md:items-center">
        {navConfig.main.map(({ href, title }) => {
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

      <Separator className="md:hidden" />

      <nav className="flex flex-1 flex-col justify-end gap-4 text-sm font-medium md:hidden">
        {navConfig.user.map(({ href, title }) => {
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
        {hasAdministrativeRights ? (
          <Link
            href="/admin"
            className={cn(
              'transition-colors hover:text-foreground/80',
              pathname === '/admin' ? 'text-foreground' : 'text-foreground/60',
            )}
          >
            Admin
          </Link>
        ) : null}
        <Button size="sm" onClick={handleSignOut}>
          Logout
        </Button>
      </nav>

      <div className="mt-4 hidden flex-1 items-center text-sm md:mt-0 md:flex md:justify-end">
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
