import type { PublicContext } from '~/server/api/trpc';

import type {
  GetRoomTypeListRequest,
  GetRoomTypeRequest,
} from './room-type.schema';

export async function list(ctx: PublicContext, input: GetRoomTypeListRequest) {
  const { filter } = input;

  return ctx.db.roomType.findMany({
    include: {
      rate: true,
      rooms: {
        where: {
          bookings: {
            every: {
              NOT: {
                AND: [
                  {
                    checkIn: {
                      lte: filter?.checkOut,
                    },
                  },
                  {
                    checkOut: {
                      gte: filter?.checkIn,
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  });
}

export async function get(ctx: PublicContext, input: GetRoomTypeRequest) {
  const { id, filter } = input;

  return ctx.db.roomType.findUnique({
    where: {
      id,
    },
    include: {
      rate: true,
      rooms: {
        where: {
          bookings: {
            every: {
              NOT: {
                AND: [
                  {
                    checkIn: {
                      lte: filter?.checkOut,
                    },
                  },
                  {
                    checkOut: {
                      gte: filter?.checkIn,
                    },
                  },
                ],
              },
            },
          },
        },
        take: 1,
      },
    },
  });
}
