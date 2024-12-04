import { randomBytes } from 'crypto';

import { BookingPaymentStatus, BookingStatus } from '@prisma/client';
import { format } from 'date-fns';

import type { EmailsService } from '../emails/emails.service';
import type { BookingsRepository } from './bookings.repository';
import type {
  CreateBookingInput,
  GetBookingInput,
  GetUserBookingListInput,
  UpdateBookingStatusInput,
} from './bookings.schema';

export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly emailsService: EmailsService,
  ) {}

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
    const { bookingNumber, stripeCustomerId } = input;

    // TODO: may be more complex logic later
    return this.markBookingAsPaid(bookingNumber, stripeCustomerId);
  }

  private generateBookingNumber(roomName: string) {
    const dateIdentifier = format(new Date(), 'yyyyMMdd');
    const roomIdentifier = roomName.toUpperCase();
    const identifier = randomBytes(3).toString('hex').toUpperCase();

    return `${dateIdentifier}${roomIdentifier}${identifier}`;
  }

  private async markBookingAsPaid(
    bookingNumber: string,
    stripeCustomerId: string,
  ) {
    const booking = await this.bookingsRepository.updateBookingStatus({
      bookingNumber,
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: BookingPaymentStatus.PAID,
      stripeCustomerId,
    });

    const {
      guestName,
      guestEmail,
      roomTypeName,
      roomName,
      checkIn,
      checkOut,
      totalAmount,
    } = booking;

    await this.emailsService.sendBookingConfirmationEmail({
      guestName,
      guestEmail,
      bookingNumber,
      roomName: `${roomTypeName} - ${roomName}`,
      checkIn: `${format(checkIn, 'PPP')} - ${format(checkIn, 'p')}`,
      checkOut: `${format(checkOut, 'PPP')} - ${format(checkOut, 'p')}`,
      totalAmount,
    });

    return booking;
  }
}
