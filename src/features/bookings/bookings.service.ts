import { randomBytes } from 'crypto';

import { format } from 'date-fns';

import type { BookingsRepository } from './bookings.repository';
import type {
  CreateBookingInput,
  GetUserBookingListInput,
} from './bookings.schema';

export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  async getUserBookingList(input: GetUserBookingListInput) {
    return this.bookingsRepository.getUserBookingList(input);
  }

  async createBooking(input: CreateBookingInput) {
    const { roomName } = input;
    const bookingNumber = this.generateBookingNumber(roomName);

    return this.bookingsRepository.createBooking({
      ...input,
      bookingNumber,
    });
  }

  private generateBookingNumber(roomName: string) {
    const dateIdentifier = format(new Date(), 'yyyyMMdd');
    const roomIdentifier = roomName.replace('-', '').toUpperCase();
    const identifier = randomBytes(3).toString('hex').toUpperCase();

    return `${dateIdentifier}${roomIdentifier}${identifier}`;
  }
}
