import { z } from 'zod';

export const createCheckoutSessionInputSchema = z.object({
  userId: z.string().min(1),
  bookingNumber: z.string().min(1),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  stripeCustomerId: z.string().min(1).nullish(),
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
