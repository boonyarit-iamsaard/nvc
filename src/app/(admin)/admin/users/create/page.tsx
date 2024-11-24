import { UserForm } from '~/features/users/components/user-form';

export default function Page() {
  return (
    <div className="container space-y-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New User</h1>
      </div>

      <UserForm />
    </div>
  );
}
