import type { Prisma } from '@prisma/client';

import type { MembershipsService } from './memberships.service';

export type GetMembershipsResult = Prisma.PromiseReturnType<
  MembershipsService['getMemberships']
>;
