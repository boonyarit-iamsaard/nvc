'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, LightbulbIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Icons } from '~/common/components/icons';
import { Message } from '~/common/components/message';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/common/components/ui/alert';
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

  if (isSuccess) {
    return (
      <Message
        variant="success"
        title="Password Changed"
        message="Your password has been changed successfully."
        confirmLabel="Back to login"
        onConfirm={handleSignOut}
      />
    );
  }

  return (
    <>
      <Card>
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
          {session && !session.user.firstLoginAt && (
            <Alert className="mb-4">
              <LightbulbIcon className="size-4" />
              <AlertTitle>First-time setup</AlertTitle>
              <AlertDescription>
                For better security, we recommend changing the temporary
                password that was sent to your email.
              </AlertDescription>
            </Alert>
          )}

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
                        type="password"
                        placeholder="Enter your new password"
                        onChange={handlePasswordChange('newPassword')}
                        value={field.value}
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
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {form.formState.errors.root.message}
                  </AlertDescription>
                </Alert>
              )}
              {isError && changePasswordState.message && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {changePasswordState.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Alert className="mt-4">
        <LightbulbIcon className="size-4" />
        <AlertTitle>Password requirements</AlertTitle>
        <AlertDescription>
          Your new password must be at least 8 characters and contain at least
          one letter and one number.
        </AlertDescription>
      </Alert>
    </>
  );
}
