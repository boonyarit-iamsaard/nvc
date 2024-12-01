import { authRouter } from '~/core/auth/auth.router';
import { createCallerFactory, createTRPCRouter } from '~/core/server/api/trpc';
import { bookingRouter } from '~/features/bookings/bookings.router';
import { paymentsRouter } from '~/features/payments/payments.router';
import { roomTypesRouter } from '~/features/room-types/room-types.router';
import { usersRouter } from '~/features/users/users.router';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  bookings: bookingRouter,
  payments: paymentsRouter,
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
