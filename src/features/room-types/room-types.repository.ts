import type { PrismaClient } from '@prisma/client';

import type {
  GetRoomTypeInput,
  GetRoomTypeListInput,
} from './room-types.schema';

export class RoomTypesRepository {
  constructor(private readonly db: PrismaClient) {}

  getRoomTypeList({ filter }: GetRoomTypeListInput) {
    const { checkIn, checkOut, userId } = filter ?? {};

    return this.db.roomType.findMany({
      include: {
        rooms: {
          where:
            checkIn && checkOut
              ? {
                  NOT: {
                    bookings: {
                      some: {
                        AND: [
                          {
                            checkIn: {
                              lte: checkOut,
                            },
                          },
                          {
                            checkOut: {
                              gte: checkIn,
                            },
                          },
                        ],
                      },
                    },
                  },
                }
              : undefined,
        },
        price: true,
        _count:
          checkIn && checkOut && userId
            ? {
                select: {
                  rooms: {
                    where: {
                      bookings: {
                        some: {
                          AND: [
                            {
                              checkIn: {
                                lte: checkOut,
                              },
                            },
                            {
                              checkOut: {
                                gte: checkIn,
                              },
                            },
                            {
                              userId,
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              }
            : undefined,
      },
    });
  }

  getRoomType({ id, filter }: GetRoomTypeInput) {
    const { checkIn, checkOut } = filter ?? {};

    return this.db.roomType.findUnique({
      where: {
        id,
      },
      include: {
        price: true,
        rooms: {
          where:
            checkIn && checkOut
              ? {
                  NOT: {
                    bookings: {
                      some: {
                        AND: [
                          {
                            checkIn: {
                              lte: checkOut,
                            },
                          },
                          {
                            checkOut: {
                              gte: checkIn,
                            },
                          },
                        ],
                      },
                    },
                  },
                }
              : undefined,
          take: 1,
        },
      },
    });
  }
}
