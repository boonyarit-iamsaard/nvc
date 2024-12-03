import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useUserSession } from '~/core/auth/hooks/use-user-session';
import { api } from '~/core/trpc/react';
import type { CreateBookingInput } from '~/features/bookings/bookings.schema';
import { bookingDateRangeSchema } from '~/features/bookings/bookings.schema';
import type { RoomTypeFilter } from '~/features/room-types/room-types.schema';

import { getBookingDetails } from '../helpers/get-booking-details';

type UseBookingFormResult = {
  bookingDetails: CreateBookingInput | null;
  error: Error | null;
  isLoading: boolean;
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
};

export function useBookingForm(): UseBookingFormResult {
  const params = useSearchParams();

  const [bookingDetails, setBookingDetails] =
    useState<CreateBookingInput | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<RoomTypeFilter | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: userSession } = useUserSession();
  const { data: roomType, isLoading } = api.roomTypes.getRoomType.useQuery({
    id: params.get('id') ?? '',
    filter,
  });

  const createBookingMutation = api.bookings.createBooking.useMutation();

  async function handleSubmit() {
    if (!bookingDetails) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createBookingMutation.mutateAsync(bookingDetails);

      if (response.data.checkoutSession.url) {
        window.location.href = response.data.checkoutSession.url;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error);
      }

      setError(new Error('Failed to create booking. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const checkIn = params.get('check-in');
    const checkOut = params.get('check-out');
    const roomId = params.get('id');
    if (!checkIn || !checkOut || !roomId) {
      return;
    }

    const { data, success } = bookingDateRangeSchema.safeParse({
      checkIn,
      checkOut,
    });
    if (!success) {
      return;
    }

    setFilter({
      checkIn: data.checkIn,
      checkOut: data.checkOut,
    });

    return () => {
      setFilter(undefined);
    };
  }, [params]);

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
    isSubmitting,
    handleSubmit,
  };
}
