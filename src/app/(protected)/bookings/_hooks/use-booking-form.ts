import { useEffect, useState } from 'react';

import { addDays, eachDayOfInterval, getDay, startOfDay } from 'date-fns';
import type { Session } from 'next-auth';

import type { SaveBookingRequest } from '~/features/bookings/bookings.schema';
import type { GetRoomTypeResponse } from '~/features/room-types/room-types.schema';
import { useUserSession } from '~/libs/auth/hooks/use-user-session';
import { api } from '~/trpc/react';

type CalculateAmountsParams = {
  weekdayCount: number;
  weekendCount: number;
  weekdayPriceAtBooking: number;
  weekendPriceAtBooking: number;
  discountPercentage?: number;
};

type CreateBookingDetailsParams = {
  user: Session['user'];
  room: NonNullable<GetRoomTypeResponse>['rooms'][number];
  roomType: NonNullable<GetRoomTypeResponse>;
  checkIn: Date;
  checkOut: Date;
};

type UseBookingFormParams = {
  roomTypeId: string | null;
  checkIn: Date | null;
  checkOut: Date | null;
};

type UseBookingFormResult = {
  bookingDetails: SaveBookingRequest | null;
  isLoading: boolean;
};

function calculateAmounts({
  weekdayCount,
  weekendCount,
  weekdayPriceAtBooking,
  weekendPriceAtBooking,
  discountPercentage = 0,
}: CalculateAmountsParams) {
  const baseAmount =
    weekdayCount * weekdayPriceAtBooking + weekendCount * weekendPriceAtBooking;

  const discountAmount = Math.floor((baseAmount * discountPercentage) / 100);

  return {
    baseAmount,
    discountAmount,
    totalAmount: baseAmount - discountAmount,
  };
}

function calculateBookingPeriod(checkIn: Date, checkOut: Date) {
  const days = eachDayOfInterval({
    start: startOfDay(checkIn),
    end: startOfDay(addDays(checkOut, -1)),
  });

  let weekdayCount = 0;
  let weekendCount = 0;

  /**
   * Sunday = 0, Monday = 1, ..., Saturday = 6
   */
  days.forEach((day) => {
    const dayOfWeek = getDay(day);
    if (dayOfWeek >= 0 && dayOfWeek <= 4) {
      /**
       * Sunday to Thursday considered as weekdays
       */
      weekdayCount++;
    } else {
      /**
       * Friday and Saturday considered as weekends
       */
      weekendCount++;
    }
  });

  return {
    weekdayCount,
    weekendCount,
  };
}

function createBookingDetails({
  user,
  room,
  roomType,
  checkIn,
  checkOut,
}: CreateBookingDetailsParams): SaveBookingRequest {
  const guestDetails = createGuestDetails(user);
  const roomDetails = createRoomDetails(roomType, room);
  const priceAtBookingDetails = createPriceDetails(roomType, user.membership);
  const bookingPeriod = calculateBookingPeriod(checkIn, checkOut);
  const amounts = calculateAmounts({
    ...bookingPeriod,
    ...priceAtBookingDetails,
  });

  return {
    ...guestDetails,
    ...roomDetails,
    ...priceAtBookingDetails,
    ...bookingPeriod,
    ...amounts,
    checkIn,
    checkOut,
    bookingStatus: 'PENDING',
    paymentStatus: 'PENDING',
  };
}

function createGuestDetails(user: Session['user']) {
  return {
    userId: user.id,
    guestName: user.name ?? null,
    guestEmail: user.email,
    guestMembershipName: user.membership?.membershipName ?? null,
    guestMembershipNumber: user.membership?.membershipNumber ?? null,
  };
}

function createPriceDetails(
  roomType: NonNullable<GetRoomTypeResponse>,
  userMembership: Session['user']['membership'],
) {
  return {
    weekdayPriceAtBooking: roomType.price.weekday,
    weekendPriceAtBooking: roomType.price.weekend,
    discountPercentage: userMembership?.roomDiscount ?? 0,
  };
}

function createRoomDetails(
  roomType: NonNullable<GetRoomTypeResponse>,
  room: NonNullable<GetRoomTypeResponse>['rooms'][number],
) {
  return {
    roomId: room.id,
    roomName: room.name,
    roomTypeName: roomType.name,
  };
}

export function useBookingForm({
  roomTypeId,
  checkIn,
  checkOut,
}: UseBookingFormParams): UseBookingFormResult {
  const [bookingDetails, setBookingDetails] =
    useState<SaveBookingRequest | null>(null);

  const { data: userSession } = useUserSession();
  const { data: roomType, isLoading: isLoadingRoomType } =
    api.roomType.getRoomType.useQuery(
      { id: roomTypeId ?? '' },
      { enabled: !!roomTypeId },
    );
  const isLoading = isLoadingRoomType;
  const room = roomType?.rooms[0];

  const hasRoom = !!room;
  const hasRoomType = !!roomType;
  const hasCheckIn = !!checkIn;
  const hasCheckOut = !!checkOut;
  const hasUser = !!userSession?.user;
  const canProcessBookingDetails =
    !isLoading &&
    hasRoom &&
    hasRoomType &&
    hasCheckIn &&
    hasCheckOut &&
    hasUser;

  useEffect(() => {
    if (
      canProcessBookingDetails &&
      userSession?.user &&
      room &&
      roomType &&
      checkIn &&
      checkOut
    ) {
      const details = createBookingDetails({
        user: userSession.user,
        room,
        roomType,
        checkIn,
        checkOut,
      });
      setBookingDetails(details);
    } else {
      setBookingDetails(null);
    }

    return () => {
      setBookingDetails(null);
    };
  }, [
    canProcessBookingDetails,
    userSession?.user,
    room,
    roomType,
    checkIn,
    checkOut,
  ]);

  return {
    bookingDetails,
    isLoading,
  };
}
