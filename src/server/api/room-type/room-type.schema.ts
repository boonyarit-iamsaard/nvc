import { isAfter } from 'date-fns';
import { z } from 'zod';

// TODO: improve the schema
export const createRoomTypeRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  code: z.string(),
  rate: z.object({
    weekday: z.number(),
    weekend: z.number(),
  }),
  maximumCapacity: z.number(),
});
export type CreateRoomTypeRequest = z.infer<typeof createRoomTypeRequestSchema>;

export const seedRoomTypeRequestSchema = createRoomTypeRequestSchema.extend({
  quantity: z.number(),
});
export type SeedRoomTypeRequest = z.infer<typeof seedRoomTypeRequestSchema>;

export const roomTypeFilterSchema = z
  .object({
    checkIn: z.date().optional(),
    checkOut: z.date().optional(),
  })
  .refine((data) => {
    const { checkIn, checkOut } = data;

    if (!checkIn || !checkOut) {
      return false;
    }

    return isAfter(checkOut, checkIn);
  });
export type RoomTypeFilter = z.infer<typeof roomTypeFilterSchema>;

export const getRoomTypeListRequestSchema = z.object({
  filter: roomTypeFilterSchema.optional(),
});
export type GetRoomTypeListRequest = z.infer<
  typeof getRoomTypeListRequestSchema
>;

export const getRoomTypeRequestSchema = getRoomTypeListRequestSchema.extend({
  id: z.string().uuid(),
});
export type GetRoomTypeRequest = z.infer<typeof getRoomTypeRequestSchema>;
