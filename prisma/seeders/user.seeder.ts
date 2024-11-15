import { hash } from '@node-rs/argon2';
import type { Membership, PrismaClient } from '@prisma/client';
import { Gender, Role } from '@prisma/client';
import { addYears, endOfDay, startOfDay, subDays } from 'date-fns';

async function hashPassword(password: string) {
  return hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

async function generateMembershipNumber(
  prisma: PrismaClient,
  membershipCode: string,
): Promise<string> {
  const sequence = await prisma.membershipSequence.findFirst({
    where: { membershipCode },
    select: { lastAssignedSequence: true },
  });

  const newSequence = (sequence?.lastAssignedSequence ?? 0) + 1;

  await prisma.membershipSequence.upsert({
    where: { membershipCode },
    create: {
      membershipCode,
      lastAssignedSequence: newSequence,
    },
    update: {
      lastAssignedSequence: newSequence,
    },
  });

  return `${membershipCode}${newSequence.toString().padStart(4, '0')}`;
}

async function createUser(
  prisma: PrismaClient,
  index: number,
  gender: Gender,
  role: Role = Role.GUEST,
) {
  const hashedPassword = await hashPassword('password');

  return prisma.user.create({
    data: {
      email: `user-${index}@example.com`,
      name: `User-${index}`,
      hashedPassword,
      gender,
      role,
    },
  });
}

async function createUserMembership(
  prisma: PrismaClient,
  userId: string,
  membership: Membership,
) {
  const startDate = startOfDay(new Date());
  const endDate = endOfDay(subDays(addYears(startDate, 1), 1));

  const membershipNumber = await generateMembershipNumber(
    prisma,
    membership.code,
  );

  return prisma.userMembership.create({
    data: {
      userId,
      membershipId: membership.id,
      membershipNumber,
      startDate,
      endDate,
    },
  });
}

export async function userSeeder(prisma: PrismaClient) {
  console.info('[SEEDER] 🌱 seeding users data');

  const memberships = await prisma.membership.findMany({
    include: {
      price: true,
    },
  });
  if (!memberships.length) {
    console.info('[SEEDER] ⏭️ skipping users data seeding');

    return;
  }

  await prisma.$transaction([
    prisma.userMembership.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);

  let index = 0;
  for (const membership of memberships) {
    const availableForMale = membership.price.male > 0;
    const availableForFemale = membership.price.female > 0;

    if (availableForMale) {
      index += 1;
      const user = await createUser(prisma, index, Gender.MALE, Role.MEMBER);
      await createUserMembership(prisma, user.id, membership);
    }

    if (availableForFemale) {
      index += 1;
      const user = await createUser(prisma, index, Gender.FEMALE, Role.MEMBER);
      await createUserMembership(prisma, user.id, membership);
    }
  }

  await createUser(prisma, index + 1, Gender.MALE);
  await createUser(prisma, index + 2, Gender.FEMALE);

  console.info('[SEEDER] ✅ users data seeded');
}
