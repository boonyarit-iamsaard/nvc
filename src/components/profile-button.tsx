'use client';

import Link from 'next/link';

import { Calendar, LogOut, ShieldCheckIcon, User } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Skeleton } from '~/components/ui/skeleton';
import { useUserSession } from '~/libs/auth/hooks/use-user-session';

export function ProfileButton() {
  const { data, status, hasAdministrativeRights, handleSignOut } =
    useUserSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full bg-accent/40 px-0"
        >
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col">
          {status === 'loading' ? <Skeleton className="h-9" /> : null}
          {status === 'authenticated' ? (
            <>
              <span>{data?.user?.name}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {data?.user?.email}
              </span>
            </>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/booking">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Bookings</span>
            </Link>
          </DropdownMenuItem>
          {hasAdministrativeRights ? (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <ShieldCheckIcon className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </Link>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
