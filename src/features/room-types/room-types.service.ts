import type { RoomTypesRepository } from './room-types.repository';
import type {
  GetRoomTypeInput,
  GetRoomTypeListInput,
} from './room-types.schema';

export class RoomTypesService {
  constructor(private readonly roomTypesRepository: RoomTypesRepository) {}

  async getRoomTypeList(input: GetRoomTypeListInput) {
    return this.roomTypesRepository.getRoomTypeList(input);
  }

  async getRoomType(input: GetRoomTypeInput) {
    return this.roomTypesRepository.getRoomType(input);
  }
}
