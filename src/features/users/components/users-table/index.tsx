'use client';

import { DataTable } from '~/common/components/data-table';
import { api } from '~/core/trpc/react';

import { columns } from './columns';

export function UsersTable() {
  const { data: users, isLoading } = api.users.getUsers.useQuery();

  return (
    <DataTable columns={columns} data={users ?? []} isLoading={isLoading} />
  );
}
