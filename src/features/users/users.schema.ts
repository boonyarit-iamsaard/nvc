import type { Prisma } from '@prisma/client';
import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

import type { UsersService } from '~/features/users/users.service';

export const baseUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  image: z.string().optional(),
  role: z.nativeEnum(Role).optional().default(Role.GUEST),
  gender: z.nativeEnum(Gender),
  stripeCustomerId: z.string().min(1).nullish().default(null),
});

export const getUserInputSchema = z.union([
  z.object({
    email: z.string().email(),
  }),
  z.object({
    id: z.string().uuid(),
  }),
]);

export const getUserCredentialsInputSchema = z.object({
  id: z.string().uuid(),
});

export const createUserInputSchema = baseUserInputSchema;

export const saveUserInputSchema = baseUserInputSchema.extend({
  hashedPassword: z.string(),
});

export const seedAdminInputSchema = baseUserInputSchema.extend({
  password: z.string(),
});

export const changePasswordInputSchema = z.object({
  id: z.string().uuid(),
  user: z.object({
    password: z.string(),
    firstLoginAt: z.date().optional(),
  }),
});

export const updatePasswordInputSchema = z.object({
  id: z.string().uuid(),
  user: z.object({
    hashedPassword: z.string(),
    firstLoginAt: z.date().optional(),
  }),
});

export const updateUserInputSchema = z.object({
  id: z.string().uuid(),
  user: baseUserInputSchema.partial().extend({
    emailVerifiedAt: z.date().optional(),
  }),
});

export const updateStripeCustomerIdInputSchema = z.object({
  email: z.string().email(),
  stripeCustomerId: z.string().min(1),
});

export type GetUserInput = z.infer<typeof getUserInputSchema>;
export type GetUserCredentialsInput = z.infer<
  typeof getUserCredentialsInputSchema
>;

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type SaveUserInput = z.infer<typeof saveUserInputSchema>;
export type SeedAdminInput = z.infer<typeof seedAdminInputSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>;

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type UpdateStripeCustomerIdInput = z.infer<
  typeof updateStripeCustomerIdInputSchema
>;

export type GetUsersResult = Prisma.PromiseReturnType<UsersService['getUsers']>;
export type GetUserResult = Prisma.PromiseReturnType<UsersService['getUser']>;
