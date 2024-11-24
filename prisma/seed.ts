import { PrismaClient } from '@prisma/client';

import { usersFactory } from './factories/users.factory';
import { adminSeeder } from './seeders/admin.seeder';
import { membershipSeeder } from './seeders/membership.seeder';
import { roomTypeSeeder } from './seeders/room-type.seeder';

const prisma = new PrismaClient();

async function main() {
  console.info('[SEEDER] 🧹 deleting existing data');

  await prisma.$transaction([
    prisma.roomType.deleteMany({}),
    prisma.membership.deleteMany({}),
    prisma.userMembership.deleteMany({}),
    prisma.userVerification.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);

  console.info('[SEEDER] ✅ existing data deleted');

  console.info('[SEEDER] 🌱 seeding data');

  const seeders: ((prisma: PrismaClient) => Promise<void>)[] = [
    roomTypeSeeder,
    membershipSeeder,
    adminSeeder,
  ];
  for (const seeder of seeders) {
    await seeder(prisma);

    if (seeders.length > 1) {
      console.info('-----------------------------------');
    }
  }

  console.info('[SEEDER] ✅ seeding complete');

  if (process.env.NODE_ENV === 'development') {
    console.info('-----------------------------------');

    const factories: ((prisma: PrismaClient) => Promise<void>)[] = [
      usersFactory,
    ];
    for (const factory of factories) {
      await factory(prisma);

      if (factories.length > 1) {
        console.info('-----------------------------------');
      }
    }

    console.info('-----------------------------------');

    console.info('[FACTORY] ✅ factory complete');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(JSON.stringify(e, null, 2));

    await prisma.$disconnect();

    process.exit(1);
  });
