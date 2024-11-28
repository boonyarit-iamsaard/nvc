import { VerificationType } from '@prisma/client';
import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const verifyTokenInputSchema = z.object({
  token: z.string(),
  type: z.nativeEnum(VerificationType),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
export type VerifyTokenInput = z.infer<typeof verifyTokenInputSchema>;
