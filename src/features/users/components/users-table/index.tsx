'use client';

import { DataTable } from '~/common/components/data-table';
import { api } from '~/core/trpc/react';

import { columns } from './columns';

export function UsersTable() {
  const { data: users, isLoading } = api.users.getUserList.useQuery();

  return (
    <DataTable columns={columns} data={users ?? []} isLoading={isLoading} />
  );
}
