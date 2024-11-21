import {
  createBookingRequestSchema,
  getUserBookingListRequestSchema,
} from '~/features/bookings/bookings.schema';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const bookingRouter = createTRPCRouter({
  getUserBookingList: publicProcedure
    .input(getUserBookingListRequestSchema)
    .query(({ ctx, input }) => {
      return ctx.services.bookingsService.getUserBookingList(input);
    }),

  createBooking: protectedProcedure
    .input(createBookingRequestSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.bookingsService.createBooking(input);
    }),
});
