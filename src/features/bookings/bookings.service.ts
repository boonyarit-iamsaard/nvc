import type { PrismaClient } from '@prisma/client';

import type { BookingsRepository } from './bookings.repository';
import type {
  CreateBookingRequest,
  GetUserBookingListRequest,
  SaveBookingRequest,
} from './bookings.schema';

export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly db: PrismaClient,
  ) {}

  async getUserBookingList(input: GetUserBookingListRequest) {
    return this.bookingsRepository.getUserBookingList(input);
  }

  async createBooking(input: CreateBookingRequest) {
    const room = await this.db.room.findUniqueOrThrow({
      where: {
        id: input.roomId,
      },
      include: {
        type: {
          include: {
            price: true,
          },
        },
      },
    });
    if (!room.type) {
      throw new Error('Room type not found');
    }

    const user = await this.db.user.findUniqueOrThrow({
      where: {
        id: input.userId,
      },
      include: {
        memberships: {
          where: {
            endDate: {
              gte: new Date(),
            },
          },
        },
      },
    });

    const checkIn = new Date(input.checkIn);
    const checkOut = new Date(input.checkOut);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    const weekdayNights = 0;
    const weekendNights = nights - weekdayNights;

    const totalAmount =
      weekdayNights * room.type?.price.weekday +
      weekendNights * room.type?.price.weekend;
    const discountAmount = 0;

    const saveBookingRequest: SaveBookingRequest = {
      ...input,
      guestName: user.name,
      guestEmail: user.email,
      guestMembershipNumber: user.memberships[0]?.membershipNumber,
      roomTypeName: room.type.name,
      roomName: room.name,
      weekdayPriceAtBooking: room.type.price.weekday,
      weekendPriceAtBooking: room.type.price.weekend,
      totalAmount,
      discountAmount,
      totalAmountAfterDiscount: totalAmount - discountAmount,
      bookingStatus: 'PENDING',
      paymentStatus: 'PENDING',
    };

    return this.bookingsRepository.createBooking(saveBookingRequest);
  }
}
