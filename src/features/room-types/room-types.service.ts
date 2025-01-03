import type { RoomTypesRepository } from './room-types.repository';
import type { GetRoomTypeInput, ListRoomTypesInput } from './room-types.schema';

export class RoomTypesService {
  constructor(private readonly roomTypesRepository: RoomTypesRepository) {}

  async listRoomTypes(input: ListRoomTypesInput) {
    return this.roomTypesRepository.listRoomTypes(input);
  }

  async getRoomType(input: GetRoomTypeInput) {
    return this.roomTypesRepository.getRoomType(input);
  }
}
