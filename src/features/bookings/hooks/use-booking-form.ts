import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useUserSession } from '~/core/auth/hooks/use-user-session';
import type { SaveBookingInput } from '~/features/bookings/bookings.schema';
import { bookingDateRangeSchema } from '~/features/bookings/bookings.schema';
import type { RoomTypeFilter } from '~/features/room-types/room-types.schema';
import { api } from '~/trpc/react';

import { getBookingDetails } from '../helpers/get-booking-details';

type UseBookingFormResult = {
  bookingDetails: SaveBookingInput | null;
  isLoading: boolean;
  isSubmitting: boolean;
  handleSubmit: () => void;
};

export function useBookingForm(): UseBookingFormResult {
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = useState<RoomTypeFilter | undefined>(undefined);
  const [bookingDetails, setBookingDetails] = useState<SaveBookingInput | null>(
    null,
  );

  const { data: userSession } = useUserSession();
  const { data: roomType, isLoading: isLoadingRoomType } =
    api.roomTypes.getRoomType.useQuery({
      id: params.get('id') ?? '',
      filter,
    });

  const createBookingMutation = api.bookings.createBooking.useMutation({
    onError(error) {
      console.error(error);
    },
    onSuccess(data) {
      console.log(data);
      router.replace('/bookings');
    },
  });

  const isLoading = isLoadingRoomType;
  const isSubmitting = createBookingMutation.isPending;

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
    isLoading,
    isSubmitting,
    handleSubmit,
  };
}
