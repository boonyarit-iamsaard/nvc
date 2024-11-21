import type { PrismaClient } from '@prisma/client';

import type {
  GetUserBookingListRequest,
  SaveBookingRequest,
} from './bookings.schema';

export class BookingsRepository {
  constructor(private readonly db: PrismaClient) {}

  async getUserBookingList({ userId }: GetUserBookingListRequest) {
    return this.db.booking.findMany({
      where: {
        userId,
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

  async createBooking(input: SaveBookingRequest) {
    return this.db.booking.create({
      data: input,
    });
  }
}
