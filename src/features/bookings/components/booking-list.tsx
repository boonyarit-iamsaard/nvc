'use client';

import Link from 'next/link';

import { ContentHeader } from '~/common/components/content-header';
import { LoadingSpinner } from '~/common/components/loading-spinner';
import { Message } from '~/common/components/message';
import { Button } from '~/common/components/ui/button';
import { useUserSession } from '~/core/auth/hooks/use-user-session';
import { api } from '~/core/trpc/react';

import { BookingListItem } from './booking-list-item';

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

  if (isLoading || !bookingList) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Message
        variant="error"
        title="Unable to Load Bookings"
        message="We encountered an error while loading your bookings. This could be due to a network issue or the bookings may be temporarily unavailable."
      >
        <div className="flex justify-center">
          <Button asChild size="sm">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Message>
    );
  }

  if (bookingList.length > 0) {
    return (
      <div className="space-y-8">
        <ContentHeader title="Your Bookings" />
        <div className="flex flex-col gap-4">
          {bookingList.map((booking) => (
            <BookingListItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Message
      variant="info"
      title="No Bookings Found"
      message="You don't have any bookings yet. Find a room to make your first reservation."
    >
      <div className="flex justify-center">
        <Button asChild size="sm">
          <Link href="/rooms">Find a Room</Link>
        </Button>
      </div>
    </Message>
  );
}
