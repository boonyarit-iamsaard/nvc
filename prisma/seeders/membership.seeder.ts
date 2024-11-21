import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { parseData } from '../helper';

const createMembershipSchema = z.object({
  name: z.string().min(1).max(10),
  code: z.string().min(1).max(10),
  roomDiscount: z.number().int().nonnegative().max(100).optional().default(0),
  price: z.object({
    female: z.number().int().nonnegative(),
    male: z.number().int().nonnegative(),
  }),
});

export async function membershipSeeder(prisma: PrismaClient) {
  console.info('[SEEDER] 🌱 seeding membership data');

  const membershipsData = parseData('memberships.json', createMembershipSchema);
  if (!membershipsData) {
    console.info('[SEEDER] ⏭️ skipping memberships data seeding');
    return;
  }

  const memberships = Array.isArray(membershipsData)
    ? membershipsData
    : [membershipsData];

  const seedingPromises = memberships.flatMap((membership) => {
    if (!membership) return [];

    const { name, price, code, roomDiscount } = membership;

    return [
      prisma.membership.upsert({
        where: { name },
        update: {
          code,
          roomDiscount,
          price: {
            update: {
              ...price,
            },
          },
        },
        create: {
          name,
          code,
          roomDiscount,
          price: {
            create: {
              ...price,
            },
          },
        },
      }),

      prisma.membershipSequence.upsert({
        where: { membershipCode: code },
        update: {
          lastAssignedSequence: 0,
        },
        create: {
          membershipCode: code,
          lastAssignedSequence: 0,
        },
      }),
    ];
  });

  await Promise.all(seedingPromises);

  console.info('[SEEDER] ✅ memberships data seeded');
}
