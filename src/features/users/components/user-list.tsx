'use client';

import { Badge } from '~/components/ui/badge';
import { api } from '~/trpc/react';

export function UserList() {
  const { data: userList, isLoading } = api.users.getUserList.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {userList?.map((user) => (
        <div
          key={user.id}
          className="space-y-2 rounded-lg border border-border p-4 shadow-sm"
        >
          <div className="font-medium">
            <span>{user.name}</span>
            {user.memberships?.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {user.memberships?.[0]?.membershipName}
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground">{user.email}</div>
        </div>
      ))}
    </div>
  );
}
