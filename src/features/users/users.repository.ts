import type { Prisma, PrismaClient } from '@prisma/client';

import type {
  GetUserCredentialsInput,
  GetUserInput,
  SaveUserInput,
  UpdatePasswordInput,
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
    const where: Prisma.UserWhereUniqueInput =
      'email' in input ? { email: input.email } : { id: input.id };

    return this.db.user.findUnique({
      where,
      select: this.defaultFields,
    });
  }

  async getUserCredentials(input: GetUserCredentialsInput) {
    const { id } = input;

    return this.db.user.findUnique({
      where: { id },
      select: { hashedPassword: true },
    });
  }

  async createUser(input: SaveUserInput) {
    return this.db.user.create({
      data: input,
      select: this.defaultFields,
    });
  }

  async updatePassword(input: UpdatePasswordInput) {
    const { id, user } = input;
    const { hashedPassword, firstLoginAt } = user;

    return this.db.user.update({
      where: { id },
      data: {
        hashedPassword,
        ...(firstLoginAt && { firstLoginAt }),
      },
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
