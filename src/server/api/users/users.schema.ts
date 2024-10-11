import { Gender, Role } from '@prisma/client';
import { z } from 'zod';

export const createUserRequestSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
  image: z.string().optional(),
  role: z.nativeEnum(Role).optional().default(Role.GUEST),
  gender: z.nativeEnum(Gender),
});
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
