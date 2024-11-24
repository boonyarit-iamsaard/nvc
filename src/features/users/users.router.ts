import {
  createUserRequestSchema,
  getUserRequestSchema,
  updateUserRequestSchema,
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
    .input(createUserRequestSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.usersService.createUser(input);
    }),

  updateUser: protectedProcedure
    .input(updateUserRequestSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.usersService.updateUser(input);
    }),
});
