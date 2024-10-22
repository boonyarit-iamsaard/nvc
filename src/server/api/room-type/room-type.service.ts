import type { PublicContext } from '~/server/api/trpc';

export async function list(ctx: PublicContext) {
  return ctx.db.roomType.findMany({
    include: {
      rate: true,
    },
  });
}
