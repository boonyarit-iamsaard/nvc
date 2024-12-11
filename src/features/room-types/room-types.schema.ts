import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { roomTypeFilterInputSchema } from '~/common/common.schema';

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

export const getRoomTypeListInputSchema = z.object({
  filter: roomTypeFilterInputSchema.optional(),
});

export const getRoomTypeInputSchema = getRoomTypeListInputSchema.extend({
  id: z.string().uuid(),
});

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeInputSchema>;
export type SeedRoomTypeInput = z.infer<typeof seedRoomTypeInputSchema>;
export type GetRoomTypeListInput = z.infer<typeof getRoomTypeListInputSchema>;
export type GetRoomTypeInput = z.infer<typeof getRoomTypeInputSchema>;

export type GetRoomTypeListResult = Awaited<
  ReturnType<RoomTypesService['getRoomTypeList']>
>;
export type GetRoomTypeResult = Prisma.PromiseReturnType<
  RoomTypesService['getRoomType']
>;
