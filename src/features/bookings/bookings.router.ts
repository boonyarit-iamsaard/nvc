import { TRPCError } from '@trpc/server';
import Stripe from 'stripe';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  webhookProcedure,
} from '~/core/server/api/trpc';

import {
  createBookingInputSchema,
  getBookingInputSchema,
  listBookingsInputSchema,
  updateBookingStatusInputSchema,
} from './bookings.schema';

export const bookingRouter = createTRPCRouter({
  listBookings: publicProcedure
    .input(listBookingsInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.bookingsService.listUserBookings(input);
    }),

  getBooking: publicProcedure
    .input(getBookingInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.bookingsService.getBooking(input);
    }),

  createBooking: protectedProcedure
    .input(createBookingInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const booking = await ctx.services.bookingsService.createBooking(input);
        const checkoutSession =
          await ctx.services.paymentsService.createCheckoutSession({
            ...booking,
            userId: input.userId,
            /**
             * Pass the stripeCustomerId from the user's session (if it exists)
             * For new users, this will be null/undefined, triggering the creation
             * of a new Stripe customer in the PaymentsService
             */
            stripeCustomerId: input.stripeCustomerId,
          });

        return {
          success: true,
          data: {
            checkoutSession: {
              url: checkoutSession.url,
              stripeCustomerId: checkoutSession.customer,
              // TODO: consider returning more checkout session details if needed
            },
          },
        };
      } catch (error) {
        console.error('Failed to create booking: ', JSON.stringify(error));

        if (error instanceof Stripe.errors.StripeError) {
          // TODO: improve error response
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create payment session. Please try again.',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create booking. Please try again.',
        });
      }
    }),

  updateBookingStatus: webhookProcedure
    .input(updateBookingStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.services.bookingsService.getBooking({
        bookingNumber: input.bookingNumber,
      });

      if (!booking) {
        console.error('Booking not found');
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        });
      }

      if (
        booking.paymentStatus !== 'PENDING' &&
        booking.bookingStatus !== 'PENDING'
      ) {
        console.error('Booking has already been processed');
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Booking has already been processed',
        });
      }

      if (booking.totalAmount !== input.amount) {
        console.error('Invalid amount');
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid amount',
        });
      }

      try {
        return ctx.services.bookingsService.updateBookingStatus(input);
      } catch (error) {
        console.error(
          'Failed to update booking status: ',
          JSON.stringify(error),
        );

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update booking status. Please try again.',
        });
      }
    }),
});
