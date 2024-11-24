import { randomBytes } from 'crypto';

import ms from 'ms';

import type { TokenRepository } from './token.repository';
import type { TokenPayload, TokenVerificationResult } from './token.types';

function generateToken(length = 32): string {
  const bytes = randomBytes(Math.ceil((length * 3) / 4));
  return bytes
    .toString('base64')
    .slice(0, length)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async create(payload: TokenPayload): Promise<string> {
    const token = generateToken();
    const expiresAt = this.parseExpiry(payload.expiresIn);

    if (!expiresAt) {
      throw new Error('Invalid expiration duration');
    }

    await this.tokenRepository.createVerification({
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
    payload: TokenPayload,
  ): Promise<TokenVerificationResult> {
    try {
      const { userId, type } = payload;
      const verification = await this.tokenRepository.findValidVerification({
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

      await this.tokenRepository.invalidateVerification(token);

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
}
