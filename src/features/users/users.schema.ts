import type { Prisma } from '@prisma/client';
import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

import type { UsersService } from '~/features/users/users.service';

export const createUserRequestSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  image: z.string().optional(),
  role: z.nativeEnum(Role).optional().default(Role.GUEST),
  gender: z.nativeEnum(Gender),
});

export const seedAdminRequestSchema = createUserRequestSchema.extend({
  password: z.string(),
});

export const saveUserRequestSchema = createUserRequestSchema.extend({
  hashedPassword: z.string(),
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
export type SeedAdminRequest = z.infer<typeof seedAdminRequestSchema>;
export type SaveUserRequest = z.infer<typeof saveUserRequestSchema>;

export type GetUserListResponse = Prisma.PromiseReturnType<
  UsersService['getUserList']
>;
