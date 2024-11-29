import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/core/server/api/trpc';
import {
  getUserBookingListInputSchema,
  saveBookingInputSchema,
} from '~/features/bookings/bookings.schema';

export const bookingRouter = createTRPCRouter({
  getUserBookingList: publicProcedure
    .input(getUserBookingListInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.bookingsService.getUserBookingList(input);
    }),

  createBooking: protectedProcedure
    .input(saveBookingInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.bookingsService.createBooking(input);
    }),
});
