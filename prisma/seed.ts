import { hash } from '@node-rs/argon2';
import { PrismaClient } from '@prisma/client';

import { createUserRequestSchema } from '~/server/api/users/users.schema';

const prisma = new PrismaClient();

const admin = {
  email: process.env.ADMIN_EMAIL,
  name: process.env.ADMIN_NAME,
  password: process.env.ADMIN_PASSWORD,
  role: process.env.ADMIN_ROLE,
  gender: process.env.ADMIN_GENDER,
};

async function main() {
  const { email, name, password, role, gender, image } =
    createUserRequestSchema.parse(admin);
  // A recommended minimum parameters - https://thecopenhagenbook.com/password-authentication#password-storage
  const hashedPassword = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      hashedPassword,
      image,
      role,
      gender,
    },
    create: {
      email,
      name,
      hashedPassword,
      image,
      role,
      gender,
    },
  });
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
