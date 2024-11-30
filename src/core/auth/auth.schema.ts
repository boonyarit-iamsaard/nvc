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

export const changePasswordBaseSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.{8,})[a-zA-Z\d\W]*$/,
      'Password must be at least 8 characters and contain at least one letter and one number',
    ),
  confirmNewPassword: z.string(),
});

export const changePasswordFormSchema = changePasswordBaseSchema.refine(
  (data) => data.newPassword === data.confirmNewPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  },
);

export const changePasswordInputSchema = changePasswordBaseSchema
  .extend({
    userId: z.string().uuid(),
    firstLoginAt: z.date().optional(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type LoginInput = z.infer<typeof loginInputSchema>;
export type VerifyTokenInput = z.infer<typeof verifyTokenInputSchema>;
export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;
