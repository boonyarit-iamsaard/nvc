import type { Prisma } from '@prisma/client';
import { z } from 'zod';

import { filterRoomTypesInputSchema } from '~/common/common.schema';

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

export const listRoomTypesInputSchema = z.object({
  filter: filterRoomTypesInputSchema.optional(),
});

export const getRoomTypeInputSchema = listRoomTypesInputSchema.extend({
  id: z.string().uuid(),
});

export type CreateRoomTypeInput = z.infer<typeof createRoomTypeInputSchema>;
export type SeedRoomTypeInput = z.infer<typeof seedRoomTypeInputSchema>;

export type ListRoomTypesInput = z.infer<typeof listRoomTypesInputSchema>;
export type ListRoomTypesResult = Awaited<
  ReturnType<RoomTypesService['listRoomTypes']>
>;

export type GetRoomTypeInput = z.infer<typeof getRoomTypeInputSchema>;
export type GetRoomTypeResult = Prisma.PromiseReturnType<
  RoomTypesService['getRoomType']
>;
