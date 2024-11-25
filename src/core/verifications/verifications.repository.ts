import type { PrismaClient, VerificationType } from '@prisma/client';

export class VerificationsRepository {
  constructor(private readonly db: PrismaClient) {}

  async createVerification(data: {
    userId: string;
    token: string;
    type: VerificationType;
    expiresAt: Date;
    invalidAt?: Date;
  }) {
    return this.db.userVerification.create({
      data: {
        userId: data.userId,
        token: data.token,
        type: data.type,
        expiresAt: data.expiresAt,
        invalidAt: data.invalidAt,
      },
    });
  }

  async findValidVerification(data: {
    userId: string;
    token: string;
    type: VerificationType;
  }) {
    const now = new Date();

    return this.db.userVerification.findFirst({
      where: {
        userId: data.userId,
        token: data.token,
        type: data.type,
        expiresAt: {
          gt: now,
        },
        invalidAt: null,
      },
    });
  }

  async invalidateVerification(token: string) {
    return this.db.userVerification.update({
      where: { token },
      data: {
        invalidAt: new Date(),
      },
    });
  }
}
