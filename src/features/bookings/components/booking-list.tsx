'use client';

import { AlertCircle } from 'lucide-react';

import { LoadingSpinner } from '~/common/components/loading-spinner';
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
      <Alert variant="destructive" className="bg-background">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load your bookings.</AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !bookingList) {
    return <LoadingSpinner />;
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
