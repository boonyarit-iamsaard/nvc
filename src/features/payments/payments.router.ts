import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/core/server/api/trpc';
import { createPaymentIntentInputSchema } from '~/features/payments/payments.schema';

export const paymentsRouter = createTRPCRouter({
  createPaymentIntent: protectedProcedure
    .input(createPaymentIntentInputSchema)
    .query(async ({ ctx, input }) => {
      try {
        const paymentIntent =
          await ctx.services.paymentsService.createPaymentIntent(input);

        return {
          success: true,
          data: {
            clientSecret: paymentIntent.client_secret,
          },
        };
      } catch (error) {
        // TODO: implement logger and standardize logging messages
        console.error('Verify email error: ', JSON.stringify(error));

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create payment intent. Please try again.',
        });
      }
    }),
});
