import { VerificationType } from '@prisma/client';
import { z } from 'zod';

export const verifyTokenInputSchema = z.object({
  token: z.string(),
  type: z.nativeEnum(VerificationType),
});

export type VerifyTokenInput = z.infer<typeof verifyTokenInputSchema>;
