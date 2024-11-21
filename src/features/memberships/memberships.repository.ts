import type { PrismaClient } from '@prisma/client';

export class MembershipsRepository {
  constructor(private readonly _db: PrismaClient) {}
}
