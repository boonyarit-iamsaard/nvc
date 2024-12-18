/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import type { PrismaClient } from '@prisma/client';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { getServerAuthSession } from '~/core/auth/auth.config';
import { AuthService } from '~/core/auth/auth.service';
import { db } from '~/core/database/client';
import { VerificationsRepository } from '~/core/verifications/verifications.repository';
import { VerificationsService } from '~/core/verifications/verifications.service';
import { BookingsRepository } from '~/features/bookings/bookings.repository';
import { BookingsService } from '~/features/bookings/bookings.service';
import { EmailsService } from '~/features/emails/emails.service';
import { MembershipsRepository } from '~/features/memberships/memberships.repository';
import { MembershipsService } from '~/features/memberships/memberships.service';
import { PaymentsService } from '~/features/payments/payments.service';
import { RoomTypesRepository } from '~/features/room-types/room-types.repository';
import { RoomTypesService } from '~/features/room-types/room-types.service';
import { UsersRepository } from '~/features/users/users.repository';
import { UsersService } from '~/features/users/users.service';

/**
 * 0. SERVICES CONTEXT
 *
 * This section defines the "services" that are available in the backend API.
 */
export function createServiceContext(db: PrismaClient) {
  /**
   * Repositories
   */
  const bookingsRepository = new BookingsRepository(db);
  const membershipsRepository = new MembershipsRepository(db);
  const roomTypesRepository = new RoomTypesRepository(db);
  const usersRepository = new UsersRepository(db);
  const verificationsRepository = new VerificationsRepository(db);

  /**
   * Standalone services
   * These services don't depend on repositories or other services
   */
  const emailsService = new EmailsService();
  const paymentsService = new PaymentsService();

  /**
   * Repository-dependent services
   * These services only depend on their respective repositories
   */
  const verificationsService = new VerificationsService(
    verificationsRepository,
  );
  const membershipsService = new MembershipsService(membershipsRepository);
  const roomTypesService = new RoomTypesService(roomTypesRepository);

  /**
   * Composite services with repository
   * These services depend on both repositories and other services
   */
  const bookingsService = new BookingsService(
    bookingsRepository,
    emailsService,
  );
  const usersService = new UsersService(
    emailsService,
    usersRepository,
    verificationsService,
  );

  /**
   * Composite services
   * These services only depend on other services
   */
  const authService = new AuthService(verificationsService, usersService);

  return {
    authService,
    bookingsService,
    emailsService,
    membershipsService,
    paymentsService,
    roomTypesService,
    usersService,
    verificationsService,
  };
}

export type ServiceContext = ReturnType<typeof createServiceContext>;

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const services = createServiceContext(db);
  const session = await getServerAuthSession();

  return {
    db,
    services,
    session,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafe on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged-in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

/**
 * Webhook procedure
 *
 * This procedure is specifically for internal webhook handlers that have already
 * been authenticated (e.g. by Stripe signature verification)
 */
export const webhookProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    const isInternalWebhook = ctx.headers.get('x-internal-webhook') === 'true';
    if (!isInternalWebhook) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message:
          'This endpoint can only be called from internal webhook handlers',
      });
    }

    return next({
      ctx: { ...ctx },
    });
  });
