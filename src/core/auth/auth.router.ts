import { TRPCError } from '@trpc/server';

import { verifyTokenInputSchema } from '~/core/auth/auth.schema';
import { InvalidTokenError } from '~/core/verifications/exceptions/invalid-token.exception';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const authRouter = createTRPCRouter({
  verifyEmail: publicProcedure
    .input(verifyTokenInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const verification =
          await ctx.services.verificationsService.verifyToken(input);

        return {
          success: true,
          message: 'Email verified successfully.',
          data: {
            userId: verification.userId,
            type: verification.type,
            invalidAt: verification.invalidAt,
            expiresAt: verification.expiresAt,
          },
        };
      } catch (error) {
        // TODO: implement logger and standardize logging messages
        console.error('Email verification error: ', JSON.stringify(error));

        if (error instanceof InvalidTokenError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unable to process verification. Please try again later.',
        });
      }
    }),
});
