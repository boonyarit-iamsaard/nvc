import { addDays, eachDayOfInterval, getDay, startOfDay } from 'date-fns';
import type { Session } from 'next-auth';

import type { SaveBookingRequest } from '~/features/bookings/bookings.schema';
import type { GetRoomTypeResult } from '~/features/room-types/room-types.schema';

type CalculateAmountsParams = {
  weekdayCount: number;
  weekendCount: number;
  weekdayPriceAtBooking: number;
  weekendPriceAtBooking: number;
  discountPercentage?: number;
};

type CreateBookingDetailsParams = {
  user: Session['user'];
  room: NonNullable<GetRoomTypeResult>['rooms'][number];
  roomType: NonNullable<GetRoomTypeResult>;
  checkIn: Date;
  checkOut: Date;
};

export function calculateAmounts({
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

export function calculateBookingPeriod(checkIn: Date, checkOut: Date) {
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

export function getBookingDetails({
  user,
  room,
  roomType,
  checkIn,
  checkOut,
}: CreateBookingDetailsParams): SaveBookingRequest {
  const guestDetails = getGuestDetails(user);
  const roomDetails = getRoomDetails(roomType, room);
  const priceAtBookingDetails = getPriceDetails(roomType, user.membership);
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

export function getGuestDetails(user: Session['user']) {
  return {
    userId: user.id,
    guestName: user.name,
    guestEmail: user.email,
    guestMembershipName: user.membership?.membershipName ?? null,
    guestMembershipNumber: user.membership?.membershipNumber ?? null,
  };
}

export function getPriceDetails(
  roomType: NonNullable<GetRoomTypeResult>,
  userMembership: Session['user']['membership'],
) {
  return {
    weekdayPriceAtBooking: roomType.price.weekday,
    weekendPriceAtBooking: roomType.price.weekend,
    discountPercentage: userMembership?.roomDiscount ?? 0,
  };
}

export function getRoomDetails(
  roomType: NonNullable<GetRoomTypeResult>,
  room: NonNullable<GetRoomTypeResult>['rooms'][number],
) {
  return {
    roomId: room.id,
    roomName: room.name,
    roomTypeName: roomType.name,
  };
}
