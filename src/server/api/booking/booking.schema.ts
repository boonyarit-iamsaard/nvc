import { z } from 'zod';

export const createBookingRequestSchema = z.object({
  roomId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
});
export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;
