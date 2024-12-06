import Link from 'next/link';

import { Message } from '~/common/components/message';
import { Button } from '~/common/components/ui/button';

export default function Page() {
  return (
    <Message
      variant="warning"
      title="Payment Cancelled"
      message="Your payment was cancelled. No charges have been made."
    >
      <div className="space-y-6">
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
      </div>
    </Message>
  );
}
