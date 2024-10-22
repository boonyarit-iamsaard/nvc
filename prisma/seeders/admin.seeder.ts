import { hash } from '@node-rs/argon2';
import type { PrismaClient } from '@prisma/client';

import { createUserRequestSchema } from '~/server/api/user/user.schema';

import { parseData } from '../helper';

export async function adminSeeder(prisma: PrismaClient) {
  console.info('[SEEDER] 🌱 seeding admin data');

  const adminData = parseData('admin.json', createUserRequestSchema);
  if (!adminData) {
    console.info('[SEEDER] ⏭️ skipping admin data seeding');

    return;
  }

  const admins = Array.isArray(adminData) ? adminData : [adminData];

  for (const admin of admins) {
    if (!admin) continue;

    const { email, password, ...rest } = admin;
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.user.upsert({
      where: { email },
      update: {
        ...rest,
        hashedPassword,
      },
      create: {
        ...rest,
        email,
        hashedPassword,
      },
    });
  }

  console.info('[SEEDER] ✅ admin data seeded');
}
