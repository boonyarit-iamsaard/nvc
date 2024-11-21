import type { PrismaClient } from '@prisma/client';

import type {
  GetRoomTypeListRequest,
  GetRoomTypeRequest,
} from './room-types.schema';

export class RoomTypesRepository {
  constructor(private readonly db: PrismaClient) {}

  getRoomTypeList({ filter }: GetRoomTypeListRequest) {
    return this.db.roomType.findMany({
      where: {
        rooms: {
          some: {
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
      include: {
        rooms: true,
        price: true,
      },
    });
  }

  getRoomType({ id, filter }: GetRoomTypeRequest) {
    return this.db.roomType.findUnique({
      where: {
        id,
      },
      include: {
        price: true,
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
}
