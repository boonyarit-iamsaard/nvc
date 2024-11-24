import { hash } from '@node-rs/argon2';

import type {
  CreateUserRequest,
  GetUserRequest,
  UpdateUserRequest,
} from '~/features/users/users.schema';

import type { UsersRepository } from './users.repository';

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUserList() {
    return this.usersRepository.getUserList();
  }

  getUser(input: GetUserRequest) {
    return this.usersRepository.getUser(input);
  }

  async createUser(input: CreateUserRequest) {
    const initialPassword = this.generatePassword();
    const hashedPassword = await this.hashPassword(initialPassword);

    const user = await this.usersRepository.createUser({
      ...input,
      hashedPassword,
    });

    return {
      user,
      initialPassword,
    };
  }

  async updateUser(input: UpdateUserRequest) {
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
