'use client';

import { DataTable } from '~/components/data-table';
import { api } from '~/trpc/react';

import { columns } from './columns';

export function UsersTable() {
  const { data: users, isLoading } = api.users.getUserList.useQuery();

  return (
    <DataTable columns={columns} data={users ?? []} isLoading={isLoading} />
  );
}
