import { z } from 'zod';

export const createCheckoutSessionInputSchema = z.object({
  bookingNumber: z.string().min(1),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestCustomerId: z.string().min(1).optional(),
  roomName: z.string().min(1),
  roomTypeName: z.string().min(1),
  weekdayCount: z.number().int().nonnegative(),
  weekendCount: z.number().int().nonnegative(),
  totalAmount: z.number().int().nonnegative(),
});

export const paymentSuccessParamsSchema = z.object({
  'booking-number': z.string().min(1),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionInputSchema
>;

export type PaymentSuccessParams = z.infer<typeof paymentSuccessParamsSchema>;
