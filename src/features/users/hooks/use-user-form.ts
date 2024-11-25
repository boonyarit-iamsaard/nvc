import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Role } from '@prisma/client';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { api } from '~/trpc/react';

import type { CreateUserRequest } from '../users.schema';
import { createUserRequestSchema } from '../users.schema';

type UseUserFormParams = {
  id?: string;
};

type UseUserFormReturn = {
  form: UseFormReturn<CreateUserRequest>;
  isEditMode: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  handleSubmit: (data: CreateUserRequest) => void;
};

export function useUserForm({ id }: UseUserFormParams): UseUserFormReturn {
  const router = useRouter();
  const isEditMode = Boolean(id);
  const utils = api.useUtils();

  const { data: user, isLoading } = api.users.getUser.useQuery(
    {
      id: id ?? '',
    },
    { enabled: !!id },
  );
  const createUserMutation = api.users.createUser.useMutation({
    onError(error) {
      console.error(error);
    },
    onSuccess() {
      void utils.users.getUserList.invalidate();
      router.replace('/admin/users');
    },
  });
  const updateUserMutation = api.users.updateUser.useMutation({
    onError(error) {
      console.error(error);
    },
    onSuccess() {
      void utils.users.getUserList.invalidate();
      router.replace('/admin/users');
    },
  });

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  const form = useForm<CreateUserRequest>({
    resolver: zodResolver(createUserRequestSchema),
    defaultValues: {
      email: '',
      name: '',
      image: '',
      role: Role.GUEST,
    },
  });

  function handleSubmit(data: CreateUserRequest) {
    if (isEditMode && id) {
      updateUserMutation.mutate({
        id,
        user: data,
      });
    } else {
      createUserMutation.mutate(data);
    }
  }

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        name: user.name,
        image: user.image ?? '',
        role: user.role,
        gender: user.gender,
      });
    }
  }, [form, user]);

  return {
    form,
    isEditMode,
    isLoading,
    isSubmitting,
    handleSubmit,
  };
}
