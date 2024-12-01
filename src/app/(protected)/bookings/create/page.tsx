import { Suspense } from 'react';

import { LoadingSpinner } from '~/common/components/loading-spinner';
import { HydrateClient } from '~/core/trpc/server';
import { BookingForm } from '~/features/bookings/components/booking-form';

export default async function Page() {
  return (
    <HydrateClient>
      <Suspense fallback={<LoadingSpinner />}>
        <BookingForm />
      </Suspense>
    </HydrateClient>
  );
}
