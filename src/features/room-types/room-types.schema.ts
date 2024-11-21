import type { Prisma } from '@prisma/client';
import { isAfter } from 'date-fns';
import { z } from 'zod';

import type { RoomTypesService } from './room-types.service';

const baseCreateRoomTypeRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  code: z.string(),
  price: z.object({
    weekday: z.number().int().nonnegative(),
    weekend: z.number().int().nonnegative(),
  }),
});

export const createRoomTypeRequestSchema = baseCreateRoomTypeRequestSchema;
export const seedRoomTypeRequestSchema = baseCreateRoomTypeRequestSchema.extend(
  {
    quantity: z.number(),
  },
);

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

export const getRoomTypeListRequestSchema = z.object({
  filter: roomTypeFilterSchema.optional(),
});

export const getRoomTypeRequestSchema = getRoomTypeListRequestSchema.extend({
  id: z.string().uuid(),
});

export type CreateRoomTypeRequest = z.infer<typeof createRoomTypeRequestSchema>;
export type SeedRoomTypeRequest = z.infer<typeof seedRoomTypeRequestSchema>;
export type RoomTypeFilter = z.infer<typeof roomTypeFilterSchema>;
export type GetRoomTypeListRequest = z.infer<
  typeof getRoomTypeListRequestSchema
>;
export type GetRoomTypeRequest = z.infer<typeof getRoomTypeRequestSchema>;

export type GetRoomTypeListResponse = Awaited<
  ReturnType<RoomTypesService['getRoomTypeList']>
>;
export type GetRoomTypeResponse = Prisma.PromiseReturnType<
  RoomTypesService['getRoomType']
>;
