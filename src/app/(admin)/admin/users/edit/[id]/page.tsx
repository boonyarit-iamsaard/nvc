import { UserForm } from '~/features/users/components/user-form';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container space-y-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>

      <UserForm id={id} />
    </div>
  );
}
