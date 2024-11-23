import type { PrismaClient } from '@prisma/client';

import type { SaveUserRequest } from '~/features/users/users.schema';

export class UsersRepository {
  constructor(private readonly db: PrismaClient) {}

  getUserList() {
    return this.db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        gender: true,
        memberships: {
          where: {
            startDate: {
              lte: new Date(),
            },
            endDate: {
              gte: new Date(),
            },
            deletedAt: {
              equals: null,
            },
          },
          take: 1,
          orderBy: {
            endDate: 'desc',
          },
          select: {
            membershipName: true,
            membershipNumber: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });
  }

  createUser(user: SaveUserRequest) {
    return this.db.user.create({
      data: user,
    });
  }
}
