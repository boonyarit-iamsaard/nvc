import { BookingForm } from '~/app/(protected)/booking/_components/booking-form';
import { HydrateClient } from '~/trpc/server';

export default async function Page() {
  return (
    <HydrateClient>
      <div className="flex h-80 flex-col items-center justify-center space-y-4 bg-muted text-muted-foreground">
        <h1 className="font-serif text-4xl font-bold">Your Booking Details</h1>
      </div>
      <BookingForm />
    </HydrateClient>
  );
}
