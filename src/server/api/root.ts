import { z } from 'zod';

import { roomTypeRouter } from '~/server/api/room-type/room-type.procedure';
import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  root: publicProcedure
    .output(
      z.object({
        message: z.string(),
      }),
    )
    .query(() => {
      return {
        message: 'ok',
      };
    }),
  roomType: roomTypeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
