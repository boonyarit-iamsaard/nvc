import Link from 'next/link';

import { AlertCircle, CheckCircle2 } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/common/components/ui/alert';
import { Button } from '~/common/components/ui/button';
import { Card, CardContent, CardHeader } from '~/common/components/ui/card';
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
      <div className="mx-auto flex max-w-screen-sm flex-col items-center gap-6">
        <Alert variant="destructive">
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

  const { 'booking-number': bookingNumber } = data;

  return (
    <Card className="mx-auto max-w-screen-sm bg-background">
      <CardHeader className="flex flex-col items-center space-y-2 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p className="text-muted-foreground">
          Thank you for your payment. Your booking has been confirmed.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Booking Reference</p>
            <p className="font-mono text-lg font-medium">{bookingNumber}</p>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/bookings">View Bookings</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
