import type { Prisma, PrismaClient } from '@prisma/client';

import type {
  GetBookingInput,
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

  async getBooking(input: GetBookingInput) {
    const where: Prisma.BookingWhereUniqueInput =
      'bookingNumber' in input
        ? { bookingNumber: input.bookingNumber }
        : { id: input.id };

    return this.db.booking.findUnique({ where });
  }

  async createBooking(input: SaveBookingInput) {
    return this.db.booking.create({
      data: input,
    });
  }
}
