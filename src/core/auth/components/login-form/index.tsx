'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { Icons } from '~/common/components/icons';
import { Button } from '~/common/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { loginInputSchema } from '~/core/auth/auth.schema';
import type { LoginInput } from '~/core/auth/auth.schema';
import { env } from '~/env';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const form = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginInputSchema),
  });

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('email', event.target.value.toLowerCase());
    form.clearErrors('email');
    setLoginErrorMessage(null);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('password', event.target.value);
    form.clearErrors('password');
    setLoginErrorMessage(null);
  };

  const onSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    setLoginErrorMessage(null);

    try {
      const { email, password } = values;
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!response?.ok) {
        const errorMessages: Record<string, string> = {
          CredentialsSignin: 'Invalid email or password. Please try again.',
        };

        const errorMessage =
          errorMessages[response?.error ?? ''] ??
          'Unable to login, please try again later';

        console.error(response?.error);
        setLoginErrorMessage(errorMessage);

        return;
      }

      setIsLoading(false);
      router.replace('/');
    } catch (error) {
      console.error(error);
      setLoginErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-6">
        <div className="flex justify-center">
          <Icons.Logo className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-center text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your {env.NEXT_PUBLIC_APP_NAME} account to continue
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="email"
                      disabled={isLoading}
                      onChange={handleEmailChange}
                      placeholder="email@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="current-password"
                      disabled={isLoading}
                      onChange={handlePasswordChange}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                  <Link
                    href="/reset-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
            {loginErrorMessage && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
                {loginErrorMessage}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
