import {
  createUserInputSchema,
  getUserRequestSchema,
  updateUserInputSchema,
} from '~/features/users/users.schema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const usersRouter = createTRPCRouter({
  getUserList: protectedProcedure.query(({ ctx }) => {
    return ctx.services.usersService.getUserList();
  }),

  getUser: protectedProcedure
    .input(getUserRequestSchema)
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
