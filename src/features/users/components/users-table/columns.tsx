'use client';

import type { ColumnDef } from '@tanstack/react-table';

import type { GetUserListResult } from '~/features/users/users.schema';

import { ActionsCell, GenderCell, RoleCell } from './cells';

export const columns: ColumnDef<GetUserListResult[number]>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: RoleCell,
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: GenderCell,
  },
  {
    id: 'actions',
    cell: ActionsCell,
  },
];
