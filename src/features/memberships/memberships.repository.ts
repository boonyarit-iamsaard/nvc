import type { PrismaClient } from '@prisma/client';

export class MembershipsRepository {
  constructor(private readonly db: PrismaClient) {}

  async getMemberships() {
    return this.db.membership.findMany();
  }
}
