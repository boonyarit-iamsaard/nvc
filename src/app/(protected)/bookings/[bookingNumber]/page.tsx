import Link from 'next/link';

import { Message } from '~/common/components/message';
import { Button } from '~/common/components/ui/button';
import { BookingDetails } from '~/features/bookings/components/booking-details';

type PageProps = {
  params: Promise<{ bookingNumber: string }>;
};

export default async function Page({ params }: PageProps) {
  const { bookingNumber } = await params;

  if (!bookingNumber) {
    return (
      <Message
        variant="error"
        title="Booking Not Found"
        message="Please check your booking details."
      >
        <div className="flex justify-center">
          <Button asChild size="sm">
            <Link href="/bookings">View Booking</Link>
          </Button>
        </div>
      </Message>
    );
  }

  return <BookingDetails bookingNumber={bookingNumber} />;
}
