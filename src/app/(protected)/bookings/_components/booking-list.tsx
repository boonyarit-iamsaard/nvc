'use client';

import { format } from 'date-fns';
import { AlertCircle, Loader2 } from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import type { GetUserBookingListResponse } from '~/features/bookings/bookings.schema';
import { useUserSession } from '~/libs/auth/hooks/use-user-session';
import { api } from '~/trpc/react';

type BookingItemProps = Readonly<{
  booking: Readonly<GetUserBookingListResponse[number]>;
}>;

function BookingItem({ booking }: BookingItemProps) {
  return (
    <Card key={booking.id}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          {booking.room?.type?.name}
          <Badge className="ml-4">{booking.room?.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Check-in: {format(new Date(booking.checkIn), 'PPpp')}</p>
        <p>Check-out: {format(new Date(booking.checkOut), 'PPpp')}</p>
      </CardContent>
    </Card>
  );
}

export function BookingList() {
  const { data } = useUserSession();
  const {
    data: bookingList,
    isLoading,
    error,
  } = api.booking.getUserBookingList.useQuery(
    { userId: data?.user.id ?? '' },
    {
      enabled: !!data?.user.id,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  );

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center space-x-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to load bookings</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading your bookings...</span>
        </div>
      </div>
    );
  }

  if (!bookingList?.length) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">
          You do not have any bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="space-y-4">
        {bookingList.map((booking) => (
          <BookingItem key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
