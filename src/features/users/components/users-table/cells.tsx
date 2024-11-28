'use client';

import Link from 'next/link';

import type { Gender } from '@prisma/client';
import type { VariantProps } from 'class-variance-authority';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import type { badgeVariants } from '~/components/ui/badge';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import type { GetUserListResult } from '~/features/users/users.schema';
import { capitalize } from '~/libs/string';

type CellProps = Readonly<{
  row: {
    original: GetUserListResult[number];
  };
}>;

export function RoleCell({ row }: CellProps) {
  const role = row.original.role;
  const capitalizedRole = capitalize(role);

  return <Badge variant="outline">{capitalizedRole}</Badge>;
}

export function GenderCell({ row }: CellProps) {
  const gender = row.original.gender;
  const capitalizedGender = capitalize(gender);

  const variant: Record<
    Gender,
    NonNullable<VariantProps<typeof badgeVariants>['variant']>
  > = {
    MALE: 'default',
    FEMALE: 'secondary',
  };

  return <Badge variant={variant[gender]}>{capitalizedGender}</Badge>;
}

export function ActionsCell({ row }: CellProps) {
  const user = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/admin/users/edit/${user.id}`}>
            <Pencil className="mr-2 size-4" />
            Edit user
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => console.log('Delete user:', user.id)}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
