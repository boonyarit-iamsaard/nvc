import { VerificationType } from '@prisma/client';
import { z } from 'zod';

export const verificationPayloadSchema = z.object({
  userId: z.string(),
  type: z.nativeEnum(VerificationType),
  expiresIn: z.string(),
  timestamp: z.number().optional(),
});

export type VerificationPayload = z.infer<typeof verificationPayloadSchema>;
export type VerificationResult = {
  isValid: boolean;
  error?: string;
};
