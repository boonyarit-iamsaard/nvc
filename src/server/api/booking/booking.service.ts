import type { ProtectedContext } from '~/server/api/trpc';

import type { CreateBookingRequest } from './booking.schema';

export async function list(ctx: ProtectedContext) {
  const { id } = ctx.session.user;

  return ctx.db.booking.findMany({
    where: {
      userId: id,
    },
    include: {
      room: {
        include: {
          type: true,
        },
      },
      user: true,
    },
  });
}

export async function create(
  ctx: ProtectedContext,
  input: CreateBookingRequest,
) {
  const { roomId, checkIn, checkOut } = input;
  const { id: userId } = ctx.session.user;

  return ctx.db.booking.create({
    data: {
      checkIn,
      checkOut,
      user: {
        connect: {
          id: userId,
        },
      },
      room: {
        connect: {
          id: roomId,
        },
      },
    },
    include: {
      room: {
        include: {
          type: true,
        },
      },
      user: true,
    },
  });
}
