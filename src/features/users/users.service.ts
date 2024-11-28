import { hash } from '@node-rs/argon2';
import { VerificationType } from '@prisma/client';

import type { VerificationsService } from '~/core/verifications/verifications.service';
import { env } from '~/env';
import type { EmailsService } from '~/features/emails/emails.service';
import { renderEmailVerificationTemplate } from '~/features/emails/templates/email-verification.template';
import type {
  CreateUserInput,
  GetUserInput,
  UpdateUserInput,
} from '~/features/users/users.schema';

import type { UsersRepository } from './users.repository';

export class UsersService {
  constructor(
    private readonly emailsService: EmailsService,
    private readonly usersRepository: UsersRepository,
    private readonly verificationsService: VerificationsService,
  ) {}

  getUserList() {
    return this.usersRepository.getUserList();
  }

  getUser(input: GetUserInput) {
    return this.usersRepository.getUser(input);
  }

  async createUser(input: CreateUserInput) {
    const initialPassword = this.generatePassword();
    const hashedPassword = await this.hashPassword(initialPassword);

    const user = await this.usersRepository.createUser({
      ...input,
      hashedPassword,
    });

    const token = await this.verificationsService.createVerification({
      userId: user.id,
      type: VerificationType.EMAIL_VERIFICATION,
      expiresIn: env.EMAIL_VERIFICATION_EXPIRES_IN,
    });

    const verificationUrl = `${env.APP_URL}/verify-email?token=${token}`;
    const html = await renderEmailVerificationTemplate({
      name: user.name,
      email: user.email,
      initialPassword,
      verificationUrl,
    });

    await this.emailsService.sendEmail({
      to: user.email,
      subject: 'Welcome to Naturist Vacation Club - Verify Your Email',
      html,
    });

    return user;
  }

  async updateUser(input: UpdateUserInput) {
    return this.usersRepository.updateUser(input);
  }

  private generatePassword(): string {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
  }
}
