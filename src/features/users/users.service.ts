import type { UsersRepository } from './users.repository';

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUserList() {
    return this.usersRepository.getUserList();
  }
}
