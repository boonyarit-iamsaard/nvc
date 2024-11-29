import { Suspense } from 'react';

import { HydrateClient } from '~/core/trpc/server';
import { BookingForm } from '~/features/bookings/components/booking-form';

export default async function Page() {
  return (
    <HydrateClient>
      <div className="flex h-80 flex-col items-center justify-center space-y-4 bg-muted text-muted-foreground">
        <h1 className="font-serif text-4xl font-bold">Your Booking Details</h1>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <BookingForm />
      </Suspense>
    </HydrateClient>
  );
}
