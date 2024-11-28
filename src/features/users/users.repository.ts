import type { PrismaClient } from '@prisma/client';

import type {
  GetUserInput,
  SaveUserInput,
  UpdateUserInput,
} from '~/features/users/users.schema';

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

  getUser({ id }: GetUserInput) {
    return this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        gender: true,
      },
    });
  }

  createUser(user: SaveUserInput) {
    return this.db.user.create({
      data: user,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        gender: true,
      },
    });
  }

  updateUser({ id, user }: UpdateUserInput) {
    return this.db.user.update({
      where: { id },
      data: user,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        gender: true,
      },
    });
  }
}
