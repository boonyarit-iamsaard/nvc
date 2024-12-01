import { z } from 'zod';

export const createPaymentIntentInputSchema = z.object({
  amount: z.number().nonnegative(),
});

export type CreatePaymentIntentInput = z.infer<
  typeof createPaymentIntentInputSchema
>;
