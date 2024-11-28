import type { Prisma } from '@prisma/client';
import { isAfter } from 'date-fns';
import { z } from 'zod';

import type { RoomTypesService } from './room-types.service';

const baseCreateRoomTypeInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  code: z.string(),
  price: z.object({
    weekday: z.number().int().nonnegative(),
    weekend: z.number().int().nonnegative(),
  }),
});

export const createRoomTypeInputSchema = baseCreateRoomTypeInputSchema;
export const seedRoomTypeInputSchema = baseCreateRoomTypeInputSchema.extend({
  quantity: z.number(),
});

export const roomTypeFilterSchema = z
  .object({
    checkIn: z.date().optional(),
    checkOut: z.date().optional(),
    userId: z.string().uuid().optional(),
  })
  .refine((data) => {
    const { checkIn, checkOut } = data;
    if (!checkIn || !checkOut) {
      return false;
    }
    return isAfter(checkOut, checkIn);
  });

export const getRoomTypeListInputSchema = z.object({
  filter: roomTypeFilterSchema.optional(),
});

export const getRoomTypeInputSchema = getRoomTypeListInputSchema.extend({
  id: z.string().uuid(),
});

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeInputSchema>;
export type SeedRoomTypeInput = z.infer<typeof seedRoomTypeInputSchema>;
export type RoomTypeFilter = z.infer<typeof roomTypeFilterSchema>;
export type GetRoomTypeListInput = z.infer<typeof getRoomTypeListInputSchema>;
export type GetRoomTypeInput = z.infer<typeof getRoomTypeInputSchema>;

export type GetRoomTypeListResult = Awaited<
  ReturnType<RoomTypesService['getRoomTypeList']>
>;
export type GetRoomTypeResult = Prisma.PromiseReturnType<
  RoomTypesService['getRoomType']
>;
