import type { MembershipsRepository } from './memberships.repository';

export class MembershipsService {
  constructor(private readonly membershipsRepository: MembershipsRepository) {}

  getMemberships() {
    return this.membershipsRepository.getMemberships();
  }
}
