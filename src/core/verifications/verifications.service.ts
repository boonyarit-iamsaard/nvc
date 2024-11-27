import { randomBytes } from 'crypto';

import ms from 'ms';

import { InvalidTokenError } from './exceptions/invalid-token.exception';
import type { VerificationsRepository } from './verifications.repository';
import type {
  CreateVerificationInput,
  VerifyTokenInput,
} from './verifications.schema';

export class VerificationsService {
  constructor(
    private readonly verificationsRepository: VerificationsRepository,
  ) {}

  async createVerification(input: CreateVerificationInput): Promise<string> {
    const { expiresIn, timestamp, type, userId } = input;

    const token = this.generateVerificationToken();
    const invalidAt = timestamp ? new Date(timestamp) : undefined;
    const expiresAt = this.parseExpiry(expiresIn);
    if (!expiresAt) {
      throw new Error(`Invalid expiration duration: ${expiresIn}`);
    }

    await this.verificationsRepository.createVerification({
      userId,
      token,
      type,
      expiresAt,
      invalidAt,
    });

    return token;
  }

  async verifyToken(input: VerifyTokenInput): Promise<boolean> {
    const { token, type } = input;

    try {
      const verification = await this.verificationsRepository.findVerification({
        token,
        type,
      });
      if (!verification) {
        throw new InvalidTokenError();
      }

      await this.verificationsRepository.invalidateVerification(token);

      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw error;
      }

      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  parseExpiry(duration: string | undefined): Date | null {
    if (!duration) {
      return null;
    }

    try {
      const milliseconds = ms(duration);
      if (!milliseconds) {
        return null;
      }

      return new Date(Date.now() + milliseconds);
    } catch {
      return null;
    }
  }

  private generateVerificationToken(length = 32): string {
    const bytes = randomBytes(Math.ceil((length * 3) / 4));
    return bytes
      .toString('base64')
      .slice(0, length)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}
