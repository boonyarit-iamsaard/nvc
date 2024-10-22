import type { PrismaClient } from '@prisma/client';

import { seedRoomTypeRequestSchema } from '~/server/api/room-types/room-types.schema';

import { parseData } from '../helper';

export async function roomTypeSeeder(prisma: PrismaClient) {
  console.info('[SEEDER] 🌱 seeding room types data');

  const roomTypesData = parseData('room-types.json', seedRoomTypeRequestSchema);
  if (!roomTypesData) {
    console.info('[SEEDER] ⏭️ skipping room types data seeding');

    return;
  }

  const roomTypes = Array.isArray(roomTypesData)
    ? roomTypesData
    : [roomTypesData];

  for (const roomType of roomTypes) {
    if (!roomType) continue;

    const { code, rate, quantity, ...rest } = roomType;

    await prisma.roomType.upsert({
      where: { code },
      update: {
        ...rest,
        rate: {
          update: rate,
        },
        rooms: {
          deleteMany: {},
          createMany: {
            data: Array.from({ length: quantity }).map((_, index) => ({
              name: `${code}-${index + 1}`,
            })),
          },
        },
      },
      create: {
        ...rest,
        code,
        rate: {
          create: rate,
        },
        rooms: {
          createMany: {
            data: Array.from({ length: quantity }).map((_, index) => ({
              name: `${code}-${index + 1}`,
            })),
          },
        },
      },
    });
  }

  console.info('[SEEDER] ✅ room types data seeded');
}
