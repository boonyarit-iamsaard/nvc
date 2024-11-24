import { hash } from '@node-rs/argon2';
import type { PrismaClient } from '@prisma/client';
import { VerificationType } from '@prisma/client';

import { TokenService } from '~/core/token';
import { TokenRepository } from '~/core/token/token.repository';
import { env } from '~/env';
import { seedAdminRequestSchema } from '~/features/users/users.schema';

import { parseData } from '../helper';

export async function adminSeeder(prisma: PrismaClient) {
  console.info('[SEEDER] 🌱 seeding admin data');

  const tokenRepository = new TokenRepository(prisma);
  const tokenService = new TokenService(tokenRepository);

  const adminData = parseData('admin.json', seedAdminRequestSchema);
  if (!adminData) {
    console.info('[SEEDER] ⏭️ skipping admin data seeding');
    return;
  }

  const now = new Date();
  const expiresAt = tokenService.parseExpiry(env.EMAIL_VERIFICATION_EXPIRES_IN);
  if (!expiresAt) {
    console.warn(
      '[SEEDER] 🚫 invalid email verification duration:',
      env.EMAIL_VERIFICATION_EXPIRES_IN,
    );

    return;
  }

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

    await tokenService.create({
      userId: user.id,
      type: VerificationType.EMAIL_VERIFICATION,
      timestamp: now.getTime(),
      expiresIn: env.EMAIL_VERIFICATION_EXPIRES_IN,
    });
  }

  console.info('[SEEDER] ✅ admin data seeded');
}
