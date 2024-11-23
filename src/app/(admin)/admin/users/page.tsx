import { UserList } from '~/features/users/components/user-list';
import { api } from '~/trpc/server';

export default async function Page() {
  void api.users.getUserList.prefetch();

  return (
    <div className="container space-y-6 py-12">
      <h1 className="text-2xl font-bold">Users</h1>
      <UserList />
    </div>
  );
}
