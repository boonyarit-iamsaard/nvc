import type { Prisma } from '@prisma/client';
import { BookingPaymentStatus, BookingStatus } from '@prisma/client';
import { z } from 'zod';

import type { BookingsService } from './bookings.service';

export const listBookingsInputSchema = z.object({
  userId: z.string().uuid(),
});

export const getBookingInputSchema = z.union([
  z.object({
    bookingNumber: z.string().min(1),
  }),
  z.object({
    id: z.string().uuid(),
  }),
]);

export const createBookingInputSchema = z.object({
  userId: z.string().uuid(),
  roomId: z.string().uuid(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestMembershipName: z.string().min(1).nullish().default(null),
  guestMembershipNumber: z.string().min(1).nullish().default(null),
  stripeCustomerId: z.string().min(1).nullish().default(null),
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
export const saveBookingInputSchema = createBookingInputSchema.extend({
  bookingNumber: z.string().min(1),
});

export const updateBookingStatusInputSchema = z.object({
  bookingNumber: z.string().min(1),
  amount: z.number().int().nonnegative(),
  stripeCustomerId: z.string().min(1),
});
export const saveBookingStatusInputSchema = z.object({
  bookingNumber: z.string().min(1),
  bookingStatus: z.nativeEnum(BookingStatus),
  paymentStatus: z.nativeEnum(BookingPaymentStatus),
  stripeCustomerId: z.string().min(1),
});

export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;
export type SaveBookingInput = z.infer<typeof saveBookingInputSchema>;

export type ListBookingsInput = z.infer<typeof listBookingsInputSchema>;
export type ListBookingsResult = Prisma.PromiseReturnType<
  BookingsService['listUserBookings']
>;

export type GetBookingInput = z.infer<typeof getBookingInputSchema>;

export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusInputSchema
>;
export type SaveBookingStatusInput = z.infer<
  typeof saveBookingStatusInputSchema
>;
