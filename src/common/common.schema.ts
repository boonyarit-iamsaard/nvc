import { isAfter, setHours, startOfHour } from 'date-fns';
import { z } from 'zod';

export const roomTypeFilterInputSchema = z
  .object({
    checkIn: z.coerce.date().optional(),
    checkOut: z.coerce.date().optional(),
    userId: z.string().uuid().optional(),
  })
  .transform((data) => {
    const { checkIn, checkOut, userId } = data;
    const formattedCheckIn = checkIn
      ? startOfHour(setHours(checkIn, 14))
      : undefined;
    const formattedCheckOut = checkOut
      ? startOfHour(setHours(checkOut, 12))
      : undefined;

    return {
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      userId,
    };
  })
  .refine((data) => {
    const { checkIn, checkOut } = data;
    if (checkIn && checkOut) {
      return isAfter(checkOut, checkIn);
    }

    return true;
  });

export type RoomTypeFilterInput = z.infer<typeof roomTypeFilterInputSchema>;
