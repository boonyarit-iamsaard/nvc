import { Gender, Role } from '@prisma/client';

import type { CreateUserRequest, GetUserResponse } from '../users.schema';

type GetUserFormDefaultValuesParams = {
  id?: string;
  getUser: (params: { id: string }) => Promise<GetUserResponse>;
};

export async function getUserFormDefaultValues({
  id,
  getUser,
}: GetUserFormDefaultValuesParams): Promise<CreateUserRequest> {
  if (id) {
    const user = await getUser({ id });
    if (user) {
      return {
        email: user.email,
        name: user.name,
        image: user.image ?? '',
        role: user.role,
        gender: user.gender,
      };
    }
  }

  return {
    email: '',
    name: '',
    image: '',
    role: Role.GUEST,
    gender: Gender.MALE,
  };
}