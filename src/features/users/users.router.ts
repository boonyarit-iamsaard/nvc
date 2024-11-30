import { createTRPCRouter, protectedProcedure } from '~/core/server/api/trpc';
import {
  createUserInputSchema,
  getUserInputSchema,
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
});
