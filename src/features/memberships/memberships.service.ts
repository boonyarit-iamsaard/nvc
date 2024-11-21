import { z } from 'zod';

import type { MembershipsRepository } from './memberships.repository';

export const assignMembershipNumberRequestSchema = z.object({
  id: z.string().uuid(),
});

export type AssignMembershipNumberRequest = z.infer<
  typeof assignMembershipNumberRequestSchema
>;

export class MembershipsService {
  constructor(private readonly _membershipsRepository: MembershipsRepository) {}

  async assignMembershipNumber(_request: AssignMembershipNumberRequest) {
    //
  }
}
