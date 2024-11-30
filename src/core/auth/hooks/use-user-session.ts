import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { signOut, useSession } from 'next-auth/react';

export function useUserSession() {
  const router = useRouter();
  const { data, status } = useSession();

  const [hasAdministrativeRights, setHasAdministrativeRights] = useState(false);

  async function handleSignOut() {
    const response = await signOut({
      redirect: false,
      callbackUrl: '/login',
    });
    router.replace(response.url);
  }

  useEffect(() => {
    const role = data?.user?.role;
    if (role === 'ADMINISTRATOR' || role === 'OWNER') {
      setHasAdministrativeRights(true);
    }

    return () => {
      setHasAdministrativeRights(false);
    };
  }, [data]);

  return {
    data,
    status,
    hasAdministrativeRights,
    handleSignOut,
  };
}
