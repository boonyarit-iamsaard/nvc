import { createTRPCRouter, publicProcedure } from '~/core/server/api/trpc';

import {
  getRoomTypeInputSchema,
  listRoomTypesInputSchema,
} from './room-types.schema';

export const roomTypesRouter = createTRPCRouter({
  listRoomTypes: publicProcedure
    .input(listRoomTypesInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.roomTypesService.listRoomTypes(input);
    }),

  getRoomType: publicProcedure
    .input(getRoomTypeInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.roomTypesService.getRoomType(input);
    }),
});
