import { randomBytes } from 'crypto';

import ms from 'ms';

import { InvalidTokenError } from './errors/invalid-token.error';
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
      throw new Error('Invalid expiry format');
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

  async verifyToken(input: VerifyTokenInput) {
    const { token, type } = input;

    const verification = await this.verificationsRepository.findVerification({
      token,
      type,
    });
    if (!verification) {
      throw new InvalidTokenError('Invalid or expired verification token.');
    }

    await this.verificationsRepository.invalidateVerification(token);

    return verification;
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
}
