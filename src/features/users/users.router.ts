import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const usersRouter = createTRPCRouter({
  getUserList: protectedProcedure.query(({ ctx }) => {
    return ctx.services.usersService.getUserList();
  }),
});
