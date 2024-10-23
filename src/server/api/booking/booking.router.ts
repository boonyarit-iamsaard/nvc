import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

import { createBookingRequestSchema } from './booking.schema';
import { create, list } from './booking.service';

export const bookingRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => list(ctx)),

  create: protectedProcedure
    .input(createBookingRequestSchema)
    .mutation(({ ctx, input }) => create(ctx, input)),
});
