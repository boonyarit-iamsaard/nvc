import { randomBytes } from 'crypto';

import { BookingPaymentStatus, BookingStatus } from '@prisma/client';
import { format } from 'date-fns';

import type { BookingsRepository } from './bookings.repository';
import type {
  CreateBookingInput,
  GetBookingInput,
  GetUserBookingListInput,
  UpdateBookingStatusInput,
} from './bookings.schema';

export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  async getUserBookingList(input: GetUserBookingListInput) {
    return this.bookingsRepository.getUserBookingList(input);
  }

  async getBooking(input: GetBookingInput) {
    return this.bookingsRepository.getBooking(input);
  }

  async createBooking(input: CreateBookingInput) {
    const { roomName } = input;
    const bookingNumber = this.generateBookingNumber(roomName);

    return this.bookingsRepository.createBooking({
      ...input,
      bookingNumber,
    });
  }

  async updateBookingStatus(input: UpdateBookingStatusInput) {
    // TODO: may be more complex logic later
    return this.markBookingAsPaid(input.bookingNumber);
  }

  private generateBookingNumber(roomName: string) {
    const dateIdentifier = format(new Date(), 'yyyyMMdd');
    const roomIdentifier = roomName.replace('-', '').toUpperCase();
    const identifier = randomBytes(3).toString('hex').toUpperCase();

    return `${dateIdentifier}${roomIdentifier}${identifier}`;
  }

  private markBookingAsPaid(bookingNumber: string) {
    return this.bookingsRepository.updateBookingStatus({
      bookingNumber,
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: BookingPaymentStatus.PAID,
    });
  }
}
