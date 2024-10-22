import type { PublicContext } from '~/server/api/trpc';

import type {
  GetRoomTypeListRequest,
  GetRoomTypeRequest,
} from './room-type.schema';

export async function list(ctx: PublicContext, _input: GetRoomTypeListRequest) {
  return ctx.db.roomType.findMany({
    include: {
      rate: true,
      // TODO: filter only available rooms
      rooms: true,
    },
  });
}

export async function get(ctx: PublicContext, input: GetRoomTypeRequest) {
  const { id } = input;

  return ctx.db.roomType.findUnique({
    where: {
      id,
    },
    include: {
      rate: true,
      rooms: {
        // TODO: filter only available rooms
        take: 1,
      },
    },
  });
}
