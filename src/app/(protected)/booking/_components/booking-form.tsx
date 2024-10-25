'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { format } from 'date-fns';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import type { BookingDateRange } from '~/server/api/booking/booking.schema';
import {
  bookingDateRangeSchema,
  createBookingRequestSchema,
} from '~/server/api/booking/booking.schema';
import { api } from '~/trpc/react';

export function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [bookingDateRange, setBookingDateRange] = useState<
    BookingDateRange | undefined
  >(undefined);

  const id = params.get('id') ?? '';
  const { data: roomType } = api.roomType.get.useQuery(
    { id },
    { enabled: !!id },
  );

  const createBookingMutation = api.booking.create.useMutation({
    onError(error) {
      // TODO: display error toast
      console.error('error', JSON.stringify(error, null, 2));
    },
    onSuccess(data) {
      // TODO: display success toast
      console.log('success', JSON.stringify(data, null, 2));
      router.replace('/booking');
    },
  });

  function createBooking() {
    const parsedData = createBookingRequestSchema.safeParse({
      roomId: roomType?.rooms?.[0]?.id,
      checkIn: bookingDateRange?.checkIn,
      checkOut: bookingDateRange?.checkOut,
    });
    if (!parsedData.success) {
      return;
    }

    const { roomId, checkIn, checkOut } = parsedData.data;
    createBookingMutation.mutate({
      roomId,
      checkIn,
      checkOut,
    });
  }

  function formatDate(date?: string) {
    if (date) {
      return format(new Date(date), 'dd LLLL yyyy');
    }

    return 'N/A';
  }

  useEffect(() => {
    const parsedDateRange = bookingDateRangeSchema.safeParse({
      checkIn: params.get('check-in'),
      checkOut: params.get('check-out'),
    });

    if (parsedDateRange.success) {
      const checkIn = new Date(parsedDateRange.data.checkIn).toISOString();
      const checkOut = new Date(parsedDateRange.data.checkOut).toISOString();

      setBookingDateRange({
        checkIn,
        checkOut,
      });
    }
  }, [params]);

  return (
    <div className="container py-8">
      <Card className="mx-auto max-w-screen-sm">
        <CardHeader>
          <CardTitle>{roomType?.name}</CardTitle>
          <CardDescription>{roomType?.rooms[0]?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <span>Check-in:</span>
            <span>{formatDate(bookingDateRange?.checkIn)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Check-out:</span>
            <span>{formatDate(bookingDateRange?.checkOut)}</span>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            type="button"
            disabled={createBookingMutation.isPending}
            onClick={createBooking}
          >
            Confirm Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
