import { authRouter } from '~/core/auth/auth.router';
import { bookingRouter } from '~/features/bookings/bookings.router';
import { roomTypesRouter } from '~/features/room-types/room-types.router';
import { usersRouter } from '~/features/users/users.router';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  bookings: bookingRouter,
  roomTypes: roomTypesRouter,
  users: usersRouter,
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
