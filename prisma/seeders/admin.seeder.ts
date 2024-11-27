import { hash } from '@node-rs/argon2';
import type { PrismaClient } from '@prisma/client';
import { VerificationType } from '@prisma/client';

import {
  VerificationsRepository,
  VerificationsService,
} from '~/core/verifications';
import { env } from '~/env';
import { seedAdminRequestSchema } from '~/features/users/users.schema';

import { parseData } from '../helper';

export async function adminSeeder(prisma: PrismaClient) {
  console.info('[SEEDER] 🌱 seeding admin data');

  const verificationRepository = new VerificationsRepository(prisma);
  const verificationService = new VerificationsService(verificationRepository);

  const adminData = parseData('admin.json', seedAdminRequestSchema);
  if (!adminData) {
    console.info('[SEEDER] ⏭️ skipping admin data seeding');

    return;
  }

  const expiresAt = verificationService.parseExpiry(
    env.EMAIL_VERIFICATION_EXPIRES_IN,
  );
  if (!expiresAt) {
    console.warn(
      '[SEEDER] 🚫 invalid email verification duration:',
      env.EMAIL_VERIFICATION_EXPIRES_IN,
    );

    return;
  }

  const now = new Date();
  const admins = Array.isArray(adminData) ? adminData : [adminData];

  for (const admin of admins) {
    if (!admin) continue;

    const { password, ...rest } = admin;
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const user = await prisma.user.create({
      data: {
        hashedPassword,
        emailVerifiedAt: now,
        firstLoginAt: now,
        ...rest,
      },
    });

    try {
      await verificationService.createVerification({
        userId: user.id,
        type: VerificationType.EMAIL_VERIFICATION,
        timestamp: now.getTime(),
        expiresIn: env.EMAIL_VERIFICATION_EXPIRES_IN,
      });
    } catch (error) {
      console.warn(
        '[SEEDER] 🚫 Failed to create email verification:',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  console.info('[SEEDER] ✅ admin data seeded');
}
