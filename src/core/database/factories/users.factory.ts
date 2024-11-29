import { hash } from '@node-rs/argon2';
import type {
  MembershipPrice,
  Prisma,
  PrismaClient,
  User,
} from '@prisma/client';
import { Gender, Role, VerificationType } from '@prisma/client';
import { addYears, endOfDay, startOfDay, subDays } from 'date-fns';

import { env } from '~/core/configs/app.env';
import { VerificationsRepository } from '~/core/verifications/verifications.repository';
import { VerificationsService } from '~/core/verifications/verifications.service';

async function findAllMemberships(prisma: PrismaClient) {
  return prisma.membership.findMany({
    include: {
      price: true,
    },
  });
}

type MembershipWithPrice = Prisma.PromiseReturnType<
  typeof findAllMemberships
>[number];

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

async function createUserVerification(
  prisma: PrismaClient,
  userId: string,
  now: Date,
) {
  const verificationRepository = new VerificationsRepository(prisma);
  const verificationService = new VerificationsService(verificationRepository);

  const expiresAt = verificationService.parseExpiry(
    env.EMAIL_VERIFICATION_EXPIRES_IN,
  );
  if (!expiresAt) {
    console.warn(
      '[FACTORY] 🚫 invalid email verification duration:',
      env.EMAIL_VERIFICATION_EXPIRES_IN,
    );

    return;
  }

  try {
    await verificationService.createVerification({
      userId,
      type: VerificationType.EMAIL_VERIFICATION,
      timestamp: now.getTime(),
      expiresIn: env.EMAIL_VERIFICATION_EXPIRES_IN,
    });
  } catch (error) {
    console.warn(
      '[FACTORY] 🚫 Failed to create email verification:',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}

async function createUser(
  prisma: PrismaClient,
  index: number,
  gender: Gender,
  now: Date,
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
      emailVerifiedAt: now,
      firstLoginAt: now,
    },
  });
}

async function createUserMembership(
  prisma: PrismaClient,
  user: User,
  membership: MembershipWithPrice,
) {
  const {
    id: userId,
    name: userName,
    email: userEmail,
    gender: userGender,
  } = user;
  const { id: membershipId, code, name: membershipName, price } = membership;

  const startDate = startOfDay(new Date());
  const endDate = endOfDay(subDays(addYears(startDate, 1), 1));
  const membershipNumber = await generateMembershipNumber(prisma, code);
  const membershipPriceAtJoining = getMembershipPrice(userGender, price);

  return prisma.userMembership.create({
    data: {
      // User information
      userId,
      userName,
      userEmail,
      userGender,

      // Membership information
      membershipId,
      membershipNumber,
      membershipName,
      membershipPriceAtJoining,

      // Membership duration
      startDate,
      endDate,
    },
  });
}

function getMembershipPrice(
  userGender: Gender,
  membershipPrice: MembershipPrice,
) {
  return userGender === Gender.FEMALE
    ? membershipPrice.female
    : membershipPrice.male;
}

export async function usersFactory(prisma: PrismaClient) {
  console.info('[FACTORY] 🌱 starting factory users data');

  const memberships = await findAllMemberships(prisma);
  if (!memberships.length) {
    console.info('[FACTORY] ⏭️ skipping factory users data');
    return;
  }

  const timestamp = new Date().getTime();
  const now = new Date(timestamp);
  let index = 0;

  for (const membership of memberships) {
    const availableForMale = membership.price.male > 0;
    const availableForFemale = membership.price.female > 0;

    if (availableForMale) {
      index += 1;
      const user = await createUser(
        prisma,
        index,
        Gender.MALE,
        now,
        Role.MEMBER,
      );
      await createUserVerification(prisma, user.id, now);
      await createUserMembership(prisma, user, membership);
    }

    if (availableForFemale) {
      index += 1;
      const user = await createUser(
        prisma,
        index,
        Gender.FEMALE,
        now,
        Role.MEMBER,
      );
      await createUserVerification(prisma, user.id, now);
      await createUserMembership(prisma, user, membership);
    }
  }

  const maleGuest = await createUser(prisma, index + 1, Gender.MALE, now);
  await createUserVerification(prisma, maleGuest.id, now);

  const femaleGuest = await createUser(prisma, index + 2, Gender.FEMALE, now);
  await createUserVerification(prisma, femaleGuest.id, now);

  console.info('[FACTORY] ✅ factory users data complete');
}
