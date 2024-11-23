import type { Prisma } from '@prisma/client';
import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

import type { UsersService } from '~/features/users/users.service';

export const createUserRequestSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
  image: z.string().optional(),
  role: z.nativeEnum(Role).optional().default(Role.GUEST),
  gender: z.nativeEnum(Gender),
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

export type GetUserListResponse = Prisma.PromiseReturnType<
  UsersService['getUserList']
>;
