import type { RoomTypesRepository } from './room-types.repository';
import type {
  GetRoomTypeListRequest,
  GetRoomTypeRequest,
} from './room-types.schema';

export class RoomTypesService {
  constructor(private readonly roomTypesRepository: RoomTypesRepository) {}

  async getRoomTypeList(input: GetRoomTypeListRequest) {
    return this.roomTypesRepository.getRoomTypeList(input);
  }

  async getRoomType(input: GetRoomTypeRequest) {
    return this.roomTypesRepository.getRoomType(input);
  }
}
