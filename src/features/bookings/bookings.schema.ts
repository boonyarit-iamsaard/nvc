import {
  BookingPaymentStatus,
  BookingStatus,
  type Prisma,
} from '@prisma/client';
import { addDays, startOfDay } from 'date-fns';
import { z } from 'zod';

import type { BookingsService } from './bookings.service';

export const bookingDateRangeSchema = z
  .object({
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
  })
  .refine(
    (value) => {
      const checkIn = startOfDay(new Date(value.checkIn));
      const tomorrow = startOfDay(addDays(new Date(), 1));

      return checkIn >= tomorrow;
    },
    {
      message: 'Check-in date should not be earlier than tomorrow',
      path: ['checkIn'],
    },
  )
  .refine(
    (value) => {
      const checkIn = startOfDay(new Date(value.checkIn));
      const checkOut = startOfDay(new Date(value.checkOut));

      return checkOut > checkIn;
    },
    {
      message: 'Check-out date should be later than check-in date',
      path: ['checkOut'],
    },
  );

export const createBookingRequestSchema = z.object({
  userId: z.string().uuid(),
  roomId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
});

export const saveBookingRequestSchema = createBookingRequestSchema.merge(
  z.object({
    guestName: z.string().min(1).nullable(),
    guestEmail: z.string().email(),
    guestMembershipNumber: z.string().optional().nullable(),
    roomTypeName: z.string(),
    roomName: z.string(),
    weekdayPriceAtBooking: z.number().int().positive(),
    weekendPriceAtBooking: z.number().int().positive(),
    totalAmount: z.number().int().positive(),
    discountAmount: z.number().int().min(0),
    totalAmountAfterDiscount: z.number().int().positive(),
    bookingStatus: z.nativeEnum(BookingStatus).default('PENDING'),
    paymentStatus: z.nativeEnum(BookingPaymentStatus).default('PENDING'),
  }),
);

export const getUserBookingListRequestSchema = z.object({
  userId: z.string().uuid(),
});

export type BookingDateRange = z.infer<typeof bookingDateRangeSchema>;
export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;
export type SaveBookingRequest = z.infer<typeof saveBookingRequestSchema>;
export type GetUserBookingListRequest = z.infer<
  typeof getUserBookingListRequestSchema
>;

export type GetUserBookingListResponse = Prisma.PromiseReturnType<
  BookingsService['getUserBookingList']
>;
