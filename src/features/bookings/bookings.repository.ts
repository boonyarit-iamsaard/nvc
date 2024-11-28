import type { PrismaClient } from '@prisma/client';

import type {
  GetUserBookingListInput,
  SaveBookingInput,
} from './bookings.schema';

export class BookingsRepository {
  constructor(private readonly db: PrismaClient) {}

  async getUserBookingList({ userId }: GetUserBookingListInput) {
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

  async createBooking(input: SaveBookingInput) {
    return this.db.booking.create({
      data: input,
    });
  }
}
