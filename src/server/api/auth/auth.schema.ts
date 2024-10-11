import { z } from 'zod';

export const loginRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;
