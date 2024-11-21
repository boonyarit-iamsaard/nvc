import { hash } from '@node-rs/argon2';
import type {
  MembershipPrice,
  Prisma,
  PrismaClient,
  User,
} from '@prisma/client';
import { Gender, Role } from '@prisma/client';
import { addYears, endOfDay, startOfDay, subDays } from 'date-fns';

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

function getMembershipPrice(
  userGender: Gender,
  membershipPrice: MembershipPrice,
) {
  return userGender === Gender.FEMALE
    ? membershipPrice.female
    : membershipPrice.male;
}

async function createUserMembership(
  prisma: PrismaClient,
  user: User,
  membership: MembershipWithPrice,
) {
  const {
    id: userId,
    name: userName = '',
    email: userEmail,
    gender: userGender,
  } = user;
  const { id: membershipId, code, name: membershipName, price } = membership;

  const startDate = startOfDay(new Date());
  const endDate = endOfDay(subDays(addYears(startDate, 1), 1));
  const membershipNumber = await generateMembershipNumber(prisma, code);

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
      membershipPriceAtJoining: getMembershipPrice(userGender, price),

      // Membership duration
      startDate,
      endDate,
    },
  });
}

export async function usersFactory(prisma: PrismaClient) {
  console.info('[FACTORY] 🌱 starting factory users data');

  const memberships = await findAllMemberships(prisma);
  if (!memberships.length) {
    console.info('[FACTORY] ⏭️ skipping factory users data');

    return;
  }

  await prisma.$transaction([
    prisma.userMembership.deleteMany({}),
    prisma.user.deleteMany({
      where: {
        NOT: {
          OR: [
            {
              role: Role.OWNER,
            },
            {
              role: Role.ADMINISTRATOR,
            },
          ],
        },
      },
    }),
  ]);

  let index = 0;
  for (const membership of memberships) {
    const availableForMale = membership.price.male > 0;
    const availableForFemale = membership.price.female > 0;

    if (availableForMale) {
      index += 1;
      const user = await createUser(prisma, index, Gender.MALE, Role.MEMBER);
      await createUserMembership(prisma, user, membership);
    }

    if (availableForFemale) {
      index += 1;
      const user = await createUser(prisma, index, Gender.FEMALE, Role.MEMBER);
      await createUserMembership(prisma, user, membership);
    }
  }

  await createUser(prisma, index + 1, Gender.MALE);
  await createUser(prisma, index + 2, Gender.FEMALE);

  console.info('[FACTORY] ✅ factory users data complete');
}
