'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { VerificationType } from '@prisma/client';
import { CheckCircle, Loader2 } from 'lucide-react';

import type { AsyncState } from '~/common/types/state';
import { createInitialAsyncState } from '~/common/types/state';
import { VerifyEmailStateCard } from '~/core/auth/components/verify-email/verify-email-state-card';
import { api } from '~/core/trpc/react';

export function VerifyEmail() {
  const router = useRouter();
  const hasVerified = useRef(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verifyEmailState, setVerifyEmailState] = useState<AsyncState<boolean>>(
    createInitialAsyncState(),
  );

  const verifyEmailMutation = api.auth.verifyEmail.useMutation({
    onSuccess(data) {
      setVerifyEmailState({
        status: 'success',
        message: data.message,
        data: data.success,
      });

      if (data.success) {
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      }
    },
    onError(error) {
      setVerifyEmailState({
        status: 'error',
        message: error.message,
        data: false,
      });
    },
  });

  const isPending = verifyEmailMutation.isPending;
  const isLoading = token && isPending && verifyEmailState.status === 'idle';
  const isSuccess =
    token && verifyEmailState.status === 'success' && verifyEmailState.data;

  useEffect(() => {
    if (token && !hasVerified.current) {
      hasVerified.current = true;

      verifyEmailMutation.mutate({
        token,
        type: VerificationType.EMAIL_VERIFICATION,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    return (
      <VerifyEmailStateCard title="Invalid Verification Link">
        <p className="text-center text-muted-foreground">
          The verification link is missing or invalid. Please use the link from
          your verification email. The ability to request a new verification
          link will be available soon.
        </p>
      </VerifyEmailStateCard>
    );
  }

  if (isLoading) {
    return (
      <VerifyEmailStateCard title="Verifying Email">
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </VerifyEmailStateCard>
    );
  }

  if (isSuccess) {
    return (
      <VerifyEmailStateCard
        title="Email Verified"
        titleClassName="text-primary"
      >
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="h-6 w-6 text-primary" />
          <div className="flex flex-col gap-2 text-center text-muted-foreground">
            <p>
              Your email has been verified successfully. You will be redirected
              to the login page shortly.
            </p>
            <p className="text-sm">
              You can log in using the initial password that was sent with your
              verification link.
            </p>
          </div>
        </div>
      </VerifyEmailStateCard>
    );
  }

  return (
    <VerifyEmailStateCard
      title="Verification Failed"
      titleClassName="text-destructive"
    >
      <p className="text-center text-muted-foreground">
        {verifyEmailState.message ??
          'Something went wrong. Please try again later.'}
      </p>
    </VerifyEmailStateCard>
  );
}
