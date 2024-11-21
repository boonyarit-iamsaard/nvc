import {
  getRoomTypeListRequestSchema,
  getRoomTypeRequestSchema,
} from '~/features/room-types/room-types.schema';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const roomTypeRouter = createTRPCRouter({
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
