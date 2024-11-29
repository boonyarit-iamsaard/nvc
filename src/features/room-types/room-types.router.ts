import { createTRPCRouter, publicProcedure } from '~/core/server/api/trpc';

import {
  getRoomTypeInputSchema,
  getRoomTypeListInputSchema,
} from './room-types.schema';

export const roomTypesRouter = createTRPCRouter({
  getRoomTypeList: publicProcedure
    .input(getRoomTypeListInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.roomTypesService.getRoomTypeList(input);
    }),

  getRoomType: publicProcedure
    .input(getRoomTypeInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.roomTypesService.getRoomType(input);
    }),
});
