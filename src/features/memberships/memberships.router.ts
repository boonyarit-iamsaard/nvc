import { createTRPCRouter, publicProcedure } from '~/core/server/api/trpc';

export const membershipsRouter = createTRPCRouter({
  getMemberships: publicProcedure.query(({ ctx }) => {
    return ctx.services.membershipsService.getMemberships();
  }),
});
