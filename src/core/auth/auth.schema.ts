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

export const changePasswordInputSchema = z
  .object({
    userId: z.string().uuid(),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]*$/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmNewPassword: z.string(),
    firstLoginAt: z.date().optional(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type LoginInput = z.infer<typeof loginInputSchema>;
export type VerifyTokenInput = z.infer<typeof verifyTokenInputSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;
