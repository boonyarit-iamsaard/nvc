import type { PrismaClient } from '@prisma/client';

import type {
  SaveVerificationInput,
  VerifyTokenInput,
} from '~/core/verifications/verifications.schema';

export class VerificationsRepository {
  constructor(private readonly db: PrismaClient) {}

  async findVerification(input: VerifyTokenInput) {
    const { token, type } = input;
    const now = new Date();

    return this.db.userVerification.findFirst({
      where: {
        token,
        type,
        expiresAt: {
          gt: now,
        },
        invalidAt: null,
      },
      include: {
        user: true,
      },
    });
  }

  async createVerification(input: SaveVerificationInput) {
    const { userId, token, type, expiresAt, invalidAt } = input;

    return this.db.userVerification.create({
      data: {
        userId,
        token,
        type,
        expiresAt,
        invalidAt,
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
