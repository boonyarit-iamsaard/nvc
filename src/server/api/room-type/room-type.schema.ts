import { isAfter } from 'date-fns';
import { z } from 'zod';

/**
 * Base schema for creating room types
 */
const baseCreateRoomTypeRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  code: z.string(),
  price: z.object({
    weekday: z.number().int().nonnegative(),
    weekend: z.number().int().nonnegative(),
  }),
});

/**
 * Schema and type for creating a single room type
 */
export const createRoomTypeRequestSchema = baseCreateRoomTypeRequestSchema;
export type CreateRoomTypeRequest = z.infer<typeof createRoomTypeRequestSchema>;

/**
 * Schema and type for seeding multiple room types
 */
export const seedRoomTypeRequestSchema = baseCreateRoomTypeRequestSchema.extend(
  {
    quantity: z.number(),
  },
);
export type SeedRoomTypeRequest = z.infer<typeof seedRoomTypeRequestSchema>;

/**
 * Schema and type for filtering room types
 */
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

/**
 * Schemas and types for room type retrieval
 */
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
