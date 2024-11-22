import { BookingList } from '~/features/bookings/components/booking-list';

export default async function Page() {
  return (
    <div>
      <div className="flex h-80 flex-col items-center justify-center space-y-4 bg-muted text-muted-foreground">
        <h1 className="font-serif text-4xl font-bold">Your Bookings</h1>
      </div>
      <BookingList />
    </div>
  );
}
