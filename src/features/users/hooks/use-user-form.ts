import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { api } from '~/trpc/react';

import { getUserFormDefaultValues } from '../helpers/get-user-form-default-values';
import type { CreateUserInput } from '../users.schema';
import { createUserInputSchema } from '../users.schema';

type UseUserFormParams = {
  id?: string;
};

type UseUserFormReturn = {
  form: UseFormReturn<CreateUserInput>;
  isEditMode: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  handleSubmit: (data: CreateUserInput) => void;
};

export function useUserForm({ id }: UseUserFormParams): UseUserFormReturn {
  const router = useRouter();
  const isEditMode = Boolean(id);
  const utils = api.useUtils();

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

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserInputSchema),
    defaultValues: () =>
      getUserFormDefaultValues({
        id,
        getUser: (params) => utils.users.getUser.fetch(params),
      }),
  });

  const { isLoading: isFormLoading } = form.formState;

  function handleSubmit(data: CreateUserInput) {
    if (isEditMode && id) {
      updateUserMutation.mutate({
        id,
        user: data,
      });
    } else {
      createUserMutation.mutate(data);
    }
  }

  return {
    form,
    isEditMode,
    isLoading: isFormLoading,
    isSubmitting,
    handleSubmit,
  };
}
