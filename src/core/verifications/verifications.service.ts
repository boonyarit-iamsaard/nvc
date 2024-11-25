import { randomBytes } from 'crypto';

import ms from 'ms';

import type { VerificationsRepository } from './verifications.repository';
import type {
  VerificationPayload,
  VerificationResult,
} from './verifications.schema';

export class VerificationsService {
  constructor(
    private readonly verificationsRepository: VerificationsRepository,
  ) {}

  async create(payload: VerificationPayload): Promise<string> {
    const token = this.generateToken();
    const expiresAt = this.parseExpiry(payload.expiresIn);

    if (!expiresAt) {
      throw new Error(`Invalid expiration duration: ${payload.expiresIn}`);
    }

    await this.verificationsRepository.createVerification({
      userId: payload.userId,
      token,
      type: payload.type,
      expiresAt,
      invalidAt: payload.timestamp ? new Date(payload.timestamp) : undefined,
    });

    return token;
  }

  async verify(
    token: string,
    payload: VerificationPayload,
  ): Promise<VerificationResult> {
    try {
      const { userId, type } = payload;
      const verification =
        await this.verificationsRepository.findValidVerification({
          userId,
          token,
          type,
        });

      if (!verification) {
        return {
          isValid: false,
          error: 'Invalid token',
        };
      }

      await this.verificationsRepository.invalidateVerification(token);

      return {
        isValid: true,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  parseExpiry(duration: string | undefined): Date | null {
    if (!duration) {
      return null;
    }

    try {
      const milliseconds = ms(duration);
      if (!milliseconds || milliseconds <= 0) {
        return null;
      }

      return new Date(Date.now() + milliseconds);
    } catch {
      return null;
    }
  }

  private generateToken(length = 32): string {
    const bytes = randomBytes(Math.ceil((length * 3) / 4));
    return bytes
      .toString('base64')
      .slice(0, length)
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}
