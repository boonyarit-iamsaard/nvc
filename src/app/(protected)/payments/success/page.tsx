import Link from 'next/link';

import { Message } from '~/common/components/message';
import { Button } from '~/common/components/ui/button';
import { paymentSuccessParamsSchema } from '~/features/payments/payments.schema';

type PageProps = {
  searchParams?: Promise<{
    'booking-number'?: string;
  }>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;

  const { data, success } = paymentSuccessParamsSchema.safeParse({
    'booking-number': searchParams?.['booking-number'],
  });

  if (!success) {
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

  const { 'booking-number': bookingNumber } = data;

  return (
    <Message
      variant="success"
      title="Payment Successful"
      message="Thank you for your payment. Your booking has been confirmed."
    >
      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Booking Reference</p>
            <p className="font-mono text-lg font-medium">{bookingNumber}</p>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href={`/bookings/${bookingNumber}`}>View Booking</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </Message>
  );
}
