'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { VerificationType } from '@prisma/client';
import { CheckCircle, Loader2 } from 'lucide-react';

import { api } from '~/trpc/react';

import { VerificationStateCard } from './verification-state-card';

const REDIRECT_DELAY_SECONDS = 5;

export function VerifyEmail() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');

  const [countdown, setCountdown] = useState(REDIRECT_DELAY_SECONDS);

  function startCountdown() {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          router.push('/login');

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }

  const {
    mutate: verifyTokenMutation,
    isPending,
    isSuccess,
    isError,
    error,
  } = api.auth.verifyEmail.useMutation({
    onSuccess() {
      return startCountdown();
    },
  });

  useEffect(() => {
    if (token) {
      verifyTokenMutation({
        token,
        type: VerificationType.EMAIL_VERIFICATION,
      });
    }
  }, [token, verifyTokenMutation]);

  return (
    <div className="container mx-auto flex w-full max-w-md flex-col gap-4">
      {!token && (
        <VerificationStateCard title="Invalid Verification Link">
          <p className="text-center text-muted-foreground">
            The verification link is missing or invalid. Please use the link
            from your verification email. The ability to request a new
            verification link will be available soon.
          </p>
        </VerificationStateCard>
      )}

      {token && isPending && (
        <VerificationStateCard title="Verifying Email">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </VerificationStateCard>
      )}

      {token && isError && (
        <VerificationStateCard
          title="Verification Failed"
          titleClassName="text-destructive"
        >
          <p className="text-center text-muted-foreground">
            {error?.message ?? 'Something went wrong. Please try again later.'}
          </p>
        </VerificationStateCard>
      )}

      {token && isSuccess && (
        <VerificationStateCard
          title="Email Verified"
          titleClassName="text-primary"
        >
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-6 w-6 text-primary" />
            <div className="flex flex-col gap-2 text-center text-muted-foreground">
              <p>
                Your email has been successfully verified. You will be
                redirected to login in {countdown} seconds.
              </p>
              <p className="text-sm">
                You can log in using the initial password that was sent with
                your verification link.
              </p>
            </div>
          </div>
        </VerificationStateCard>
      )}
    </div>
  );
}
