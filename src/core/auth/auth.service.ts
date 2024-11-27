import { VerificationType } from '@prisma/client';

import type { VerificationsService } from '~/core/verifications/verifications.service';

export class AuthService {
  constructor(private readonly verificationsService: VerificationsService) {}

  async verifyToken(token: string) {
    return this.verificationsService.verifyToken({
      token,
      type: VerificationType.EMAIL_VERIFICATION,
    });
  }
}
