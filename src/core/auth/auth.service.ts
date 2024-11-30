import { verify } from '@node-rs/argon2';
import { VerificationType } from '@prisma/client';

import type { ChangePasswordInput } from '~/core/auth/auth.schema';
import type { VerificationsService } from '~/core/verifications/verifications.service';
import type { UsersService } from '~/features/users/users.service';

import { InvalidCredentialsError } from './errors/invalid-credentials.error';

export class AuthService {
  constructor(
    private readonly verificationsService: VerificationsService,
    private readonly usersService: UsersService,
  ) {}

  async verifyToken(token: string) {
    return this.verificationsService.verifyToken({
      token,
      type: VerificationType.EMAIL_VERIFICATION,
    });
  }

  async changePassword(input: ChangePasswordInput) {
    const { userId, currentPassword, newPassword, firstLoginAt } = input;

    const user = await this.usersService.getUserCredentials({ id: userId });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const hashedPassword = user.hashedPassword;
    if (!hashedPassword) {
      throw new InvalidCredentialsError();
    }

    const isValidPassword = await verify(user.hashedPassword, currentPassword);
    if (!isValidPassword) {
      throw new InvalidCredentialsError();
    }

    return this.usersService.changePassword({
      id: userId,
      user: {
        password: newPassword,
        firstLoginAt,
      },
    });
  }
}
