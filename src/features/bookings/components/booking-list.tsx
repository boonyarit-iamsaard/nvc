'use client';

import { AlertCircle, Loader2 } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/common/components/ui/alert';
import { useUserSession } from '~/core/auth/hooks/use-user-session';
import { api } from '~/core/trpc/react';

import { BookingItem } from './booking-item';

export function BookingList() {
  const { data } = useUserSession();
  const {
    data: bookingList,
    isLoading,
    error,
  } = api.bookings.getUserBookingList.useQuery(
    { userId: data?.user.id ?? '' },
    {
      enabled: !!data?.user.id,
    },
  );

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load your bookings.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || !bookingList) {
    return (
      <Alert>
        <Loader2 className="size-4 animate-spin" />
        <AlertDescription>Loading your bookings...</AlertDescription>
      </Alert>
    );
  }

  if (bookingList.length === 0) {
    return (
      <Alert>
        <AlertDescription>You do not have any bookings.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {bookingList.map((booking) => (
        <BookingItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
