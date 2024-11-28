import type { Prisma } from '@prisma/client';
import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

import type { UsersService } from '~/features/users/users.service';

export const createUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  image: z.string().optional(),
  role: z.nativeEnum(Role).optional().default(Role.GUEST),
  gender: z.nativeEnum(Gender),
});

export const seedAdminInputSchema = createUserInputSchema.extend({
  password: z.string(),
});

export const saveUserInputSchema = createUserInputSchema.extend({
  hashedPassword: z.string(),
});

export const updateUserInputSchema = z.object({
  id: z.string().uuid(),
  user: createUserInputSchema,
});

export const getUserRequestSchema = z.object({
  id: z.string().uuid(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type SeedAdminInput = z.infer<typeof seedAdminInputSchema>;
export type SaveUserInput = z.infer<typeof saveUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type GetUserInput = z.infer<typeof getUserRequestSchema>;

export type GetUserListResult = Prisma.PromiseReturnType<
  UsersService['getUserList']
>;
export type GetUserResult = Prisma.PromiseReturnType<UsersService['getUser']>;
