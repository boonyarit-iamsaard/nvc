import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import {
  getRoomTypeListRequestSchema,
  getRoomTypeRequestSchema,
} from './room-types.schema';

export const roomTypesRouter = createTRPCRouter({
  getRoomTypeList: publicProcedure
    .input(getRoomTypeListRequestSchema)
    .query(({ ctx, input }) => {
      return ctx.services.roomTypesService.getRoomTypeList(input);
    }),

  getRoomType: publicProcedure
    .input(getRoomTypeRequestSchema)
    .query(({ ctx, input }) => {
      return ctx.services.roomTypesService.getRoomType(input);
    }),
});
