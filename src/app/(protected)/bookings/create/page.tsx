import { Suspense } from 'react';

import { HydrateClient } from '~/core/trpc/server';
import { BookingForm } from '~/features/bookings/components/booking-form';

export default async function Page() {
  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <BookingForm />
      </Suspense>
    </HydrateClient>
  );
}
