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
} from '~/features/bookings/bookings.schema';
import type { RoomTypeFilter } from '~/features/room-types/room-types.schema';
import { useUserSession } from '~/libs/auth/hooks/use-user-session';
import { api } from '~/trpc/react';

export function BookingForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: userSession } = useUserSession();

  const [filter, setFilter] = useState<RoomTypeFilter | undefined>(undefined);

  const id = params.get('id') ?? '';
  const { data: roomType } = api.roomType.getRoomType.useQuery(
    {
      id,
      filter,
    },
    {
      enabled: !!id && !!filter?.checkIn && !!filter?.checkOut,
    },
  );

  const createBookingMutation = api.booking.createBooking.useMutation({
    onError() {
      // TODO: handle error
    },
    onSuccess() {
      // TODO: display success message
      router.replace('/booking');
    },
  });

  function createBooking() {
    const { data, success } = createBookingRequestSchema.safeParse({
      userId: userSession?.user?.id,
      roomId: roomType?.rooms?.[0]?.id,
      checkIn: filter?.checkIn,
      checkOut: filter?.checkOut,
    });
    if (!success) {
      return;
    }

    const { userId, roomId, checkIn, checkOut } = data;
    createBookingMutation.mutate({
      userId,
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
