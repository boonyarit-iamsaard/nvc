import Link from 'next/link';

import { XCircle } from 'lucide-react';

import { Button } from '~/common/components/ui/button';
import { Card, CardContent, CardHeader } from '~/common/components/ui/card';

export default function Page() {
  return (
    <Card className="mx-auto max-w-screen-sm bg-background">
      <CardHeader className="flex flex-col items-center space-y-2 text-center">
        <XCircle className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Payment Cancelled</h1>
        <p className="text-muted-foreground">
          Your payment was cancelled. No charges have been made.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4 text-center">
          <p className="text-muted-foreground">
            If you encountered any issues or need assistance, please contact our
            support team.
          </p>
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
