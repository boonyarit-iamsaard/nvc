import type { BookingsRepository } from './bookings.repository';
import type {
  GetUserBookingListRequest,
  SaveBookingRequest,
} from './bookings.schema';

export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  async getUserBookingList(input: GetUserBookingListRequest) {
    return this.bookingsRepository.getUserBookingList(input);
  }

  async createBooking(input: SaveBookingRequest) {
    return this.bookingsRepository.createBooking(input);
  }
}
