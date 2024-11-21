import type { PrismaClient } from '@prisma/client';

import { seedRoomTypeRequestSchema } from '~/features/room-types/room-types.schema';

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

    const { code, price, quantity, ...rest } = roomType;

    await prisma.roomType.upsert({
      where: { code },
      update: {
        ...rest,
        price: {
          update: price,
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
        price: {
          create: price,
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
