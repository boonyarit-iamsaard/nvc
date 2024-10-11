import { PrismaClient } from '@prisma/client';
import { adminSeeder } from 'prisma/seeders/admin.seeder';

const prisma = new PrismaClient();

async function main() {
  console.info('[SEEDER] 🌱 seeding data');

  const seeders = [adminSeeder];
  for (const seeder of seeders) {
    await seeder(prisma);
  }

  console.info('[SEEDER] ✅ seeding complete');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(JSON.stringify(e));
    await prisma.$disconnect();
    process.exit(1);
  });
