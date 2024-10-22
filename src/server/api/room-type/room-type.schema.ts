import { z } from 'zod';

// TODO: improve the schema
export const createRoomTypeRequestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  code: z.string(),
  rate: z.object({
    weekday: z.number(),
    weekend: z.number(),
  }),
  maximumCapacity: z.number(),
});
export type CreateRoomTypeRequest = z.infer<typeof createRoomTypeRequestSchema>;

export const seedRoomTypeRequestSchema = createRoomTypeRequestSchema.extend({
  quantity: z.number(),
});
export type SeedRoomTypeRequest = z.infer<typeof seedRoomTypeRequestSchema>;
