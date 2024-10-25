import { addDays, startOfDay } from 'date-fns';
import { z } from 'zod';

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
export type BookingDateRange = z.infer<typeof bookingDateRangeSchema>;

export const createBookingRequestSchema = z.object({
  roomId: z.string(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
});
export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;
