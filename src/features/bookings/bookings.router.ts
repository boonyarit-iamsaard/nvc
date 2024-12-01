import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/core/server/api/trpc';
import {
  createBookingInputSchema,
  getUserBookingListInputSchema,
} from '~/features/bookings/bookings.schema';

export const bookingRouter = createTRPCRouter({
  getUserBookingList: publicProcedure
    .input(getUserBookingListInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.bookingsService.getUserBookingList(input);
    }),

  createBooking: protectedProcedure
    .input(createBookingInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.bookingsService.createBooking(input);
    }),
});
