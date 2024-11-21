import { z } from 'zod';

export const getUserRequestSchema = z.object({
  id: z.string().uuid(),
});

export type GetUserRequest = z.infer<typeof getUserRequestSchema>;
