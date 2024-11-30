import { TRPCError } from '@trpc/server';

import {
  changePasswordInputSchema,
  verifyTokenInputSchema,
} from '~/core/auth/auth.schema';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/core/server/api/trpc';
import { InvalidTokenError } from '~/core/verifications/errors/invalid-token.error';

import { InvalidCredentialsError } from './errors/invalid-credentials.error';

export const authRouter = createTRPCRouter({
  verifyEmail: publicProcedure
    .input(verifyTokenInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const verification =
          await ctx.services.verificationsService.verifyToken(input);

        await ctx.services.usersService.updateUser({
          id: verification.userId,
          user: { emailVerifiedAt: new Date() },
        });

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
        console.error('Verify email error: ', JSON.stringify(error));

        if (error instanceof InvalidTokenError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to verify email. Please try again.',
        });
      }
    }),

  changePassword: protectedProcedure
    .input(changePasswordInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.services.authService.changePassword(input);

        return {
          success: true,
          message: 'Password updated successfully.',
        };
      } catch (error) {
        // TODO: implement logger and standardize logging messages
        console.error('Change password error: ', JSON.stringify(error));

        if (error instanceof InvalidCredentialsError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update password. Please try again.',
        });
      }
    }),
});
