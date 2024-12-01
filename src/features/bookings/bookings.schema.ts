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
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
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

export const createBookingInputSchema = z.object({
  userId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestMembershipName: z.string().min(1).nullish().default(null),
  guestMembershipNumber: z.string().min(1).nullish().default(null),
  roomTypeName: z.string().min(1),
  roomName: z.string().min(1),
  weekdayCount: z.number().int().nonnegative(),
  weekendCount: z.number().int().nonnegative(),
  weekdayPriceAtBooking: z.number().int().nonnegative(),
  weekendPriceAtBooking: z.number().int().nonnegative(),
  baseAmount: z.number().int().nonnegative(),
  discountAmount: z.number().int().nonnegative(),
  discountPercentage: z
    .number()
    .int()
    .nonnegative()
    .max(100)
    .optional()
    .default(0),
  totalAmount: z.number().int().nonnegative(),
  bookingStatus: z
    .nativeEnum(BookingStatus)
    .optional()
    .default(BookingStatus.PENDING),
  paymentStatus: z
    .nativeEnum(BookingPaymentStatus)
    .optional()
    .default(BookingPaymentStatus.PENDING),
});

export const saveBookingSchema = createBookingInputSchema.extend({
  bookingNumber: z.string().min(1),
});

export const getUserBookingListInputSchema = z.object({
  userId: z.string().uuid(),
});

export type BookingDateRange = z.infer<typeof bookingDateRangeSchema>;
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;
export type SaveBookingInput = z.infer<typeof saveBookingSchema>;
export type GetUserBookingListInput = z.infer<
  typeof getUserBookingListInputSchema
>;

export type GetUserBookingListResult = Prisma.PromiseReturnType<
  BookingsService['getUserBookingList']
>;
