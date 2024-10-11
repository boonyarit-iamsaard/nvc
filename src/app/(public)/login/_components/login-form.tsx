'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import type { LoginRequest } from '~/server/api/auth/auth.schema';
import { loginRequestSchema } from '~/server/api/auth/auth.schema';

export function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const form = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginRequestSchema),
  });

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    form.setValue('email', event.target.value);
    form.clearErrors('email');
    setLoginErrorMessage(null);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    form.setValue('password', event.target.value);
    form.clearErrors('password');
    setLoginErrorMessage(null);
  }

  async function onSubmit(values: LoginRequest) {
    setLoading(true);
    setLoginErrorMessage(null);

    const { email, password } = values;
    const response = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!response?.ok) {
      const errorMessages: Record<string, string> = {
        CredentialsSignin: 'Invalid email or password. Please try again.',
        // Add more error codes and messages as needed
      };

      const errorMessage =
        errorMessages[response?.error ?? ''] ??
        'Unable to login, please try again later';
      console.error(response?.error);
      setLoginErrorMessage(errorMessage);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.replace('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-md">
        <Card>
          <CardHeader className="md:p-8">
            <CardTitle className="text-lg md:text-2xl">
              Login to Naturist Vacation Club
            </CardTitle>
            <CardDescription>
              Welcome back, Please login to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="md:p-8 md:pt-0">
            <div className="grid gap-4">
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
                        disabled={loading}
                        placeholder="email@example.com"
                        type="email"
                        value={field.value}
                        onChange={handleEmailChange}
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
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/reset-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="current-password"
                        disabled={loading}
                        type="password"
                        value={field.value}
                        onChange={handlePasswordChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {loginErrorMessage ? (
              <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
                {loginErrorMessage}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="md:p-8 md:pt-0">
            <Button type="submit" className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
