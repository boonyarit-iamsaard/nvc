import type { BookingsRepository } from './bookings.repository';
import type {
  GetUserBookingListInput,
  SaveBookingInput,
} from './bookings.schema';

export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  async getUserBookingList(input: GetUserBookingListInput) {
    return this.bookingsRepository.getUserBookingList(input);
  }

  async createBooking(input: SaveBookingInput) {
    return this.bookingsRepository.createBooking(input);
  }
}
