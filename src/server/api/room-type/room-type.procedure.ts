import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

import * as services from './room-type.service';

export const roomTypeRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => services.list(ctx)),
});
