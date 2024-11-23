import { createUserRequestSchema } from '~/features/users/users.schema';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const usersRouter = createTRPCRouter({
  getUserList: protectedProcedure.query(({ ctx }) => {
    return ctx.services.usersService.getUserList();
  }),

  createUser: protectedProcedure
    .input(createUserRequestSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.usersService.createUser(input);
    }),
});
