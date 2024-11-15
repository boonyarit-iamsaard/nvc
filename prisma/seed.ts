import { PrismaClient } from '@prisma/client';

import { adminSeeder } from './seeders/admin.seeder';
import { membershipSeeder } from './seeders/membership.seeder';
import { roomTypeSeeder } from './seeders/room-type.seeder';
import { userSeeder } from './seeders/user.seeder';

const prisma = new PrismaClient();

async function main() {
  console.info('[SEEDER] 🌱 seeding data');

  const seeders: ((prisma: PrismaClient) => Promise<void>)[] = [
    roomTypeSeeder,
    membershipSeeder,
    userSeeder,
    adminSeeder,
  ];
  for (const seeder of seeders) {
    await seeder(prisma);

    if (seeders.length > 1) {
      console.info('-----------------------------------');
    }
  }

  console.info('[SEEDER] ✅ seeding complete');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
