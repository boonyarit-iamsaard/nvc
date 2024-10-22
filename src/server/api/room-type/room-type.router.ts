import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import {
  getRoomTypeListRequestSchema,
  getRoomTypeRequestSchema,
} from './room-type.schema';
import { get, list } from './room-type.service';

export const roomTypeRouter = createTRPCRouter({
  list: publicProcedure
    .input(getRoomTypeListRequestSchema)
    .query(({ ctx, input }) => list(ctx, input)),

  get: publicProcedure
    .input(getRoomTypeRequestSchema)
    .query(({ ctx, input }) => get(ctx, input)),
});
