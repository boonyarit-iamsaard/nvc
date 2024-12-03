import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  webhookProcedure,
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

  markBookingAsPaid: webhookProcedure
    .input(z.object({ bookingNumber: z.string().min(1) }))
    .mutation(({ input }) => {
      console.log('mark booking as paid: ', input.bookingNumber);
    }),
});
