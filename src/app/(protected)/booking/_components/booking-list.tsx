'use client';

import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { api } from '~/trpc/react';

export function BookingList() {
  const { data: bookingList, isLoading } = api.booking.list.useQuery();

  let content: JSX.Element;

  // TODO: improve conditional rendering and styling
  if (isLoading) {
    content = (
      <div className="flex w-full items-center justify-center space-x-2">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  } else if (bookingList?.length) {
    content = (
      <div className="space-y-4">
        {bookingList.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle className="items-centerbg-red-50 flex text-lg">
                {booking.room.type.name}
                <Badge className="ml-4">{booking.room.name}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Check-in: {format(new Date(booking.checkIn), 'PPpp')}</p>
              <p>Check-out: {format(new Date(booking.checkOut), 'PPpp')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else {
    content = (
      <p className="text-center text-muted-foreground">
        You do not have any bookings.
      </p>
    );
  }

  return <div className="container py-8">{content}</div>;
}
