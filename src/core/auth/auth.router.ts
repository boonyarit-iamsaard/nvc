import { verifyTokenInputSchema } from '~/core/auth/auth.schema';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const authRouter = createTRPCRouter({
  verifyEmail: publicProcedure
    .input(verifyTokenInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.services.verificationsService.verifyToken(input);
    }),
});
