import type { Prisma, PrismaClient } from '@prisma/client';

import type {
  CreateBookingParams,
  GetBookingInput,
  GetUserBookingListInput,
  UpdateBookingStatusParams,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getBooking(input: GetBookingInput) {
    const where: Prisma.BookingWhereUniqueInput =
      'bookingNumber' in input
        ? { bookingNumber: input.bookingNumber }
        : { id: input.id };

    return this.db.booking.findUnique({
      where,
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

  async createBooking(input: CreateBookingParams) {
    return this.db.booking.create({
      data: input,
      select: {
        bookingNumber: true,
        checkIn: true,
        checkOut: true,
        guestName: true,
        guestEmail: true,
        // guestCustomerId: true,
        roomName: true,
        roomTypeName: true,
        totalAmount: true,
      },
    });
  }

  async updateBookingStatus(input: UpdateBookingStatusParams) {
    const { bookingNumber, bookingStatus, paymentStatus } = input;

    return this.db.booking.update({
      where: {
        bookingNumber,
      },
      data: {
        bookingStatus,
        paymentStatus,
      },
    });
  }
}
