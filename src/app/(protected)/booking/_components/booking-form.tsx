'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { differenceInDays, format, startOfDay } from 'date-fns';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  bookingDateRangeSchema,
  createBookingRequestSchema,
} from '~/server/api/booking/booking.schema';
import type { RoomTypeFilter } from '~/server/api/room-type/room-type.schema';
import { api } from '~/trpc/react';

export function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [filter, setFilter] = useState<RoomTypeFilter | undefined>(undefined);

  const id = params.get('id') ?? '';
  const { data: roomType } = api.roomType.get.useQuery(
    {
      id,
      filter,
    },
    { enabled: !!id && !!filter?.checkIn && !!filter?.checkOut },
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
    const { data, success } = createBookingRequestSchema.safeParse({
      roomId: roomType?.rooms?.[0]?.id,
      checkIn: filter?.checkIn,
      checkOut: filter?.checkOut,
    });
    if (!success) {
      return;
    }

    const { roomId, checkIn, checkOut } = data;
    createBookingMutation.mutate({
      roomId,
      checkIn,
      checkOut,
    });
  }

  function formatDisplayDatetime(date?: Date) {
    if (date) {
      const formattedDate = format(date, 'LLLL dd, yyyy');
      const formattedTime = format(date, 'h:mm a');

      return {
        date: formattedDate,
        time: formattedTime,
      };
    }

    return {
      date: '',
      time: '',
    };
  }

  function calculateDurationInDays(filter?: RoomTypeFilter) {
    if (filter?.checkIn && filter?.checkOut) {
      return differenceInDays(
        startOfDay(filter.checkOut),
        startOfDay(filter.checkIn),
      );
    }

    return 0;
  }

  useEffect(() => {
    const { success, data } = bookingDateRangeSchema.safeParse({
      checkIn: params.get('check-in'),
      checkOut: params.get('check-out'),
    });

    if (success) {
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);

      setFilter({
        checkIn,
        checkOut,
      });
    }
  }, [params]);

  return (
    <div className="container py-8">
      <Card className="mx-auto max-w-screen-md">
        <CardHeader>
          <CardTitle>Your booking details</CardTitle>
          <CardDescription>
            Please review your booking information before confirming.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium">Room Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-medium">{roomType?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Number</span>
                <span className="font-medium">
                  {roomType?.rooms?.[0]?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="my-4 h-px bg-border"></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Duration</span>
              <div className="font-medium">
                {calculateDurationInDays(filter)} nights
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in</span>
                <div className="text-right">
                  <div className="font-medium">
                    {formatDisplayDatetime(filter?.checkIn).date}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDisplayDatetime(filter?.checkIn).time}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out</span>
                <div className="text-right">
                  <div className="font-medium">
                    {formatDisplayDatetime(filter?.checkOut).date}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDisplayDatetime(filter?.checkOut).time}
                  </div>
                </div>
              </div>
            </div>
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
