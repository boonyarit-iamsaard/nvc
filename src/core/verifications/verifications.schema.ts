import { VerificationType } from '@prisma/client';
import { z } from 'zod';

export const createVerificationInputSchema = z.object({
  userId: z.string(),
  type: z.nativeEnum(VerificationType),
  expiresIn: z.string(),
  timestamp: z.number().optional(),
});

export const saveVerificationInputSchema = createVerificationInputSchema
  .omit({
    expiresIn: true,
  })
  .extend({
    token: z.string(),
    expiresAt: z.coerce.date(),
    invalidAt: z.coerce.date().optional(),
  });

export const verifyTokenInputSchema = z.object({
  token: z.string(),
  type: z.nativeEnum(VerificationType),
});

export type CreateVerificationInput = z.infer<
  typeof createVerificationInputSchema
>;
export type SaveVerificationInput = z.infer<typeof saveVerificationInputSchema>;
export type VerifyTokenInput = z.infer<typeof verifyTokenInputSchema>;
export type VerifyTokenResult = {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    type: string;
    invalidAt: Date | null;
    expiresAt: Date;
  };
};
