import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  roomTypeFilterInputSchema,
  type RoomTypeFilterInput,
} from '~/common/common.schema';
import { useUserSession } from '~/core/auth/hooks/use-user-session';
import { api } from '~/core/trpc/react';
import type { CreateBookingInput } from '~/features/bookings/bookings.schema';

import { getBookingDetails } from '../helpers/get-booking-details';

type UseBookingFormResult = {
  bookingDetails: CreateBookingInput | null;
  error: Error | null;
  isLoading: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
};

export function useBookingForm(): UseBookingFormResult {
  const params = useSearchParams();

  const [bookingDetails, setBookingDetails] =
    useState<CreateBookingInput | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<RoomTypeFilterInput | undefined>(
    undefined,
  );

  const { data: userSession } = useUserSession();
  const { data: roomType, isLoading } = api.roomTypes.getRoomType.useQuery({
    id: params.get('id') ?? '',
    filter,
  });

  const createBookingMutation = api.bookings.createBooking.useMutation({
    onError(error) {
      console.error('Create booking error: ', JSON.stringify(error));
      if (error instanceof Error) {
        setError(error);

        return;
      }

      setError(new Error('Failed to create booking. Please try again.'));
    },
    onSuccess(data) {
      if (data.data.checkoutSession.url) {
        window.location.href = data.data.checkoutSession.url;
      }
    },
  });

  function handleSubmit() {
    if (!bookingDetails) {
      return;
    }

    createBookingMutation.mutate(bookingDetails);
  }

  useEffect(() => {
    const checkIn = params.get('check-in');
    const checkOut = params.get('check-out');
    const roomId = params.get('id');
    if (!checkIn || !checkOut || !roomId) {
      return;
    }

    const { data, success } = roomTypeFilterInputSchema.safeParse({
      checkIn,
      checkOut,
    });
    if (!success) {
      return;
    }

    setFilter({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      userId: userSession?.user?.id,
    });

    return () => {
      setFilter(undefined);
    };
  }, [params, userSession?.user?.id]);

  useEffect(() => {
    if (
      !filter?.checkIn ||
      !filter?.checkOut ||
      !roomType ||
      !roomType.rooms[0] ||
      !userSession?.user
    ) {
      return;
    }

    const room = roomType.rooms[0];
    const details = getBookingDetails({
      user: userSession.user,
      room,
      roomType,
      checkIn: filter.checkIn,
      checkOut: filter.checkOut,
    });

    setBookingDetails(details);

    return () => {
      setBookingDetails(null);
    };
  }, [filter, roomType, userSession?.user]);

  return {
    bookingDetails,
    error,
    isLoading,
    isSubmitting: createBookingMutation.isPending,
    handleSubmit,
  };
}
