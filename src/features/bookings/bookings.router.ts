import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/core/server/api/trpc';

import {
  createBookingInputSchema,
  getBookingInputSchema,
  getUserBookingListInputSchema,
} from './bookings.schema';

export const bookingRouter = createTRPCRouter({
  getUserBookingList: publicProcedure
    .input(getUserBookingListInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.bookingsService.getUserBookingList(input);
    }),

  getBooking: publicProcedure
    .input(getBookingInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.bookingsService.getBooking(input);
    }),

  createBooking: protectedProcedure
    .input(createBookingInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.bookingsService.createBooking(input);
    }),
});
