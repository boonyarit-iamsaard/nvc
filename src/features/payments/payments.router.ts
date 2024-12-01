import { TRPCError } from '@trpc/server';

import { createTRPCRouter, protectedProcedure } from '~/core/server/api/trpc';

import { createCheckoutSessionInputSchema } from './payments.schema';

export const paymentsRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(createCheckoutSessionInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const checkoutSession =
          await ctx.services.paymentsService.createCheckoutSession(input);

        return {
          success: true,
          data: {
            // TODO: consider returning checkout session url instead of session object
            checkoutSession,
          },
        };
      } catch (error) {
        // TODO: implement logger and standardize logging messages
        console.error('Create checkout session error: ', JSON.stringify(error));

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session. Please try again.',
        });
      }
    }),
});
