import { TRPCError } from '@trpc/server';

import {
  createTRPCRouter,
  protectedProcedure,
  webhookProcedure,
} from '~/core/server/api/trpc';
import {
  createUserInputSchema,
  getUserInputSchema,
  updateStripeCustomerIdInputSchema,
  updateUserInputSchema,
} from '~/features/users/users.schema';

export const usersRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.services.usersService.getUsers();
  }),

  getUser: protectedProcedure
    .input(getUserInputSchema)
    .query(({ ctx, input }) => {
      return ctx.services.usersService.getUser(input);
    }),

  createUser: protectedProcedure
    .input(createUserInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.usersService.createUser(input);
    }),

  updateUser: protectedProcedure
    .input(updateUserInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.usersService.updateUser(input);
    }),

  updateUserStripeCustomerId: webhookProcedure
    .input(updateStripeCustomerIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.services.usersService.getUser({
        email: input.email,
      });
      if (!user) {
        console.error('User not found');
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return ctx.services.usersService.updateUser({
        id: user.id,
        user: { stripeCustomerId: input.stripeCustomerId },
      });
    }),
});
