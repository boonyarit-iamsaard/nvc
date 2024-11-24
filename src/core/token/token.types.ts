import type { VerificationType } from '@prisma/client';

export type TokenPayload = {
  userId: string;
  type: VerificationType;
  timestamp: number;
  expiresIn: string;
};

export type TokenVerificationResult = {
  isValid: boolean;
  error?: string;
};
