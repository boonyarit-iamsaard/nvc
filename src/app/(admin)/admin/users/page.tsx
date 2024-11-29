import Link from 'next/link';

import { Plus } from 'lucide-react';

import { Button } from '~/common/components/ui/button';
import { api } from '~/core/trpc/server';
import { UsersTable } from '~/features/users/components/users-table';

export default async function Page() {
  void api.users.getUserList.prefetch();

  return (
    <div className="container space-y-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/admin/users/create">
            <Plus className="mr-2 h-4 w-4" />
            Add user
          </Link>
        </Button>
      </div>
      <UsersTable />
    </div>
  );
}
