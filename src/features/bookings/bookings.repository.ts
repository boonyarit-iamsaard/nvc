import type { Prisma, PrismaClient } from '@prisma/client';

import type {
  GetBookingInput,
  ListBookingsInput,
  SaveBookingInput,
  SaveBookingStatusInput,
} from './bookings.schema';

export class BookingsRepository {
  constructor(private readonly db: PrismaClient) {}

  async listUserBookings({ userId }: ListBookingsInput) {
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

  async createBooking(input: SaveBookingInput) {
    return this.db.booking.create({
      data: input,
      select: {
        bookingNumber: true,
        checkIn: true,
        checkOut: true,
        guestName: true,
        guestEmail: true,
        stripeCustomerId: true,
        roomName: true,
        roomTypeName: true,
        weekdayCount: true,
        weekendCount: true,
        totalAmount: true,
      },
    });
  }

  async updateBookingStatus(input: SaveBookingStatusInput) {
    const { bookingNumber, bookingStatus, paymentStatus, stripeCustomerId } =
      input;

    return this.db.booking.update({
      where: {
        bookingNumber,
      },
      data: {
        bookingStatus,
        paymentStatus,
        stripeCustomerId,
      },
    });
  }
}
