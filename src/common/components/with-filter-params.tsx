import { useEffect, useState, type ComponentType } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  filterRoomTypesInputSchema,
  type FilterRoomTypesInput,
} from '~/common/common.schema';
import { useUserSession } from '~/core/auth/hooks/use-user-session';

export type WithFilterParamsProps = {
  filterParams?: FilterRoomTypesInput;
};

export function withFilterParams<P extends WithFilterParamsProps>(
  Component: ComponentType<P>,
) {
  return function WithFilterParams(
    props: Omit<P, keyof WithFilterParamsProps>,
  ) {
    const params = useSearchParams();
    const { data: userSession } = useUserSession();

    const [filter, setFilter] = useState<FilterRoomTypesInput | undefined>(
      undefined,
    );

    useEffect(() => {
      const checkIn = params.get('check-in');
      const checkOut = params.get('check-out');
      const { data } = filterRoomTypesInputSchema.safeParse({
        checkIn,
        checkOut,
        userId: userSession?.user.id,
      });

      setFilter(data);

      return () => {
        setFilter(undefined);
      };
    }, [params, userSession?.user.id]);

    return <Component {...(props as P)} filterParams={filter} />;
  };
}
