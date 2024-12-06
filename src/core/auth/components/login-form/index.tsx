'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { Icons } from '~/common/components/icons';
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
import type { LoginInput } from '~/core/auth/auth.schema';
import { loginInputSchema } from '~/core/auth/auth.schema';
import { useUserSession } from '~/core/auth/hooks/use-user-session';
import { env } from '~/core/configs/app.env';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { data: session, status } = useUserSession();

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
        setIsLoading(false);

        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setLoginErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (!session.user.firstLoginAt) {
        router.replace('/change-password');
      } else {
        router.replace('/');
      }
    }
  }, [status, session, router]);

  return (
    <Card>
      <CardHeader className="space-y-6">
        <div className="flex justify-center">
          <Link href="/">
            <Icons.Logo className="h-12 w-auto hover:fill-muted-foreground" />
          </Link>
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
                      placeholder="password"
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
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
            {loginErrorMessage && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{loginErrorMessage}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
