import { AlertCircle } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/common/components/ui/alert';
import { Button } from '~/common/components/ui/button';
import { BookingDetails } from '~/features/bookings/components/booking-details';

type PageProps = {
  params: Promise<{ bookingNumber: string }>;
};

export default async function Page({ params }: PageProps) {
  const { bookingNumber } = await params;

  if (!bookingNumber) {
    return (
      <div className="flex flex-col items-center gap-6">
        <Alert variant="destructive" className="bg-background">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Booking reference not found. Please check your booking details.
          </AlertDescription>
        </Alert>
        <Button asChild size="lg">
          <a href="/bookings">View Bookings</a>
        </Button>
      </div>
    );
  }

  return <BookingDetails bookingNumber={bookingNumber} />;
}
