'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { StatusMessage } from '~/common/components/form/status-message';
import { Icons } from '~/common/components/icons';
import { Button } from '~/common/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/common/components/ui/form';
import { Input } from '~/common/components/ui/input';
import type { AsyncState } from '~/common/types/state';
import { createInitialAsyncState } from '~/common/types/state';
import type {
  ChangePasswordFormInput,
  ChangePasswordInput,
} from '~/core/auth/auth.schema';
import { changePasswordFormSchema } from '~/core/auth/auth.schema';
import { useUserSession } from '~/core/auth/hooks/use-user-session';
import { api } from '~/core/trpc/react';

export function ChangePasswordForm() {
  const { data: session, handleSignOut } = useUserSession();

  const [changePasswordState, setChangePasswordState] = useState<AsyncState>(
    createInitialAsyncState(),
  );

  const form = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const changePasswordMutation = api.auth.changePassword.useMutation({
    onError(error) {
      form.reset();
      setChangePasswordState({
        status: 'error',
        message: error.message,
        data: null,
      });
    },
    onSuccess(data) {
      setChangePasswordState({
        status: 'success',
        message: data.message,
        data: null,
      });
    },
  });

  function resetChangePasswordState() {
    setChangePasswordState(createInitialAsyncState());
  }

  function handlePasswordChange(fieldName: keyof ChangePasswordFormInput) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      form.setValue(fieldName, e.target.value);
      form.clearErrors(fieldName);
      resetChangePasswordState();
    };
  }

  function handleSubmit(data: ChangePasswordFormInput) {
    const userId = session?.user.id;
    if (!userId) {
      form.setError('root', {
        message: 'User session not found. Please try logging in again.',
      });

      return;
    }

    resetChangePasswordState();

    const firstLoginAt = session?.user.firstLoginAt ? undefined : new Date();
    const submitData: ChangePasswordInput = {
      ...data,
      userId,
      firstLoginAt,
    };

    changePasswordMutation.mutate(submitData);
  }

  const isLoading = changePasswordMutation.isPending;
  const isSuccess = changePasswordState.status === 'success';
  const isError = changePasswordState.status === 'error';

  return (
    <Card>
      {isSuccess ? (
        <>
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <Link href="/">
                <Icons.Logo className="h-12 w-auto hover:fill-muted-foreground" />
              </Link>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-center text-2xl">
                Password Changed
              </CardTitle>
              <CardDescription className="text-center">
                Your password has been changed successfully. Please log in again
                with your new password.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button type="button" className="w-full" onClick={handleSignOut}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <Link href="/">
                <Icons.Logo className="h-12 w-auto hover:fill-muted-foreground" />
              </Link>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-center text-2xl">
                Change Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your current password and choose a new password
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          onChange={handlePasswordChange('currentPassword')}
                          placeholder="Current Password"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          onChange={handlePasswordChange('newPassword')}
                          placeholder="New Password"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          onChange={handlePasswordChange('confirmNewPassword')}
                          placeholder="Confirm New Password"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.root?.message && (
                  <StatusMessage variant="destructive">
                    {form.formState.errors.root.message}
                  </StatusMessage>
                )}
                {isError && changePasswordState.message && (
                  <StatusMessage variant="destructive">
                    {changePasswordState.message}
                  </StatusMessage>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Change Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  );
}
