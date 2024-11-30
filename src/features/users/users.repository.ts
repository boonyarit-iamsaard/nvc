import type { Prisma, PrismaClient } from '@prisma/client';

import type {
  GetUserInput,
  SaveUserInput,
  UpdateUserInput,
} from '~/features/users/users.schema';

export class UsersRepository {
  constructor(private readonly db: PrismaClient) {}

  private readonly defaultFields: Prisma.UserSelect = {
    id: true,
    email: true,
    name: true,
    image: true,
    role: true,
    gender: true,
  } as const;

  async getUsers() {
    return this.db.user.findMany({
      select: this.defaultFields,
    });
  }

  async getUser(input: GetUserInput) {
    const { id } = input;

    return this.db.user.findUnique({
      where: { id },
      select: this.defaultFields,
    });
  }

  async createUser(input: SaveUserInput) {
    return this.db.user.create({
      data: input,
      select: this.defaultFields,
    });
  }

  async updateUser(input: UpdateUserInput) {
    const { id, user } = input;

    return this.db.user.update({
      where: { id },
      data: user,
      select: this.defaultFields,
    });
  }
}
