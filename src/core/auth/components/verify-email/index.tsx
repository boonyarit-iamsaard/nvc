'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { VerificationType } from '@prisma/client';
import { CheckCircle, Loader2 } from 'lucide-react';

import { VerificationStateCard } from '~/core/auth/components/verify-email/verification-state-card';
import { api } from '~/core/trpc/react';

type VerificationState = {
  success: boolean | null;
  message: string | null;
};

export function VerifyEmail() {
  const router = useRouter();
  const hasVerified = useRef(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      success: null,
      message: null,
    },
  );

  const verifyEmailMutation = api.auth.verifyEmail.useMutation({
    onSuccess(data) {
      setVerificationState({
        success: data.success,
        message: data.message,
      });

      if (data.success) {
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      }
    },
    onError(error) {
      setVerificationState({
        success: false,
        message: error.message,
      });
    },
  });

  const isEmailVerificationPending = verifyEmailMutation.isPending;
  const isVerificationInProgress =
    token && isEmailVerificationPending && verificationState.success === null;
  const isVerificationSuccessful = token && verificationState.success === true;
  const isVerificationFailed = token && verificationState.success === false;

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

      {isVerificationInProgress && (
        <VerificationStateCard title="Verifying Email">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </VerificationStateCard>
      )}

      {isVerificationSuccessful && (
        <VerificationStateCard
          title="Email Verified"
          titleClassName="text-primary"
        >
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-6 w-6 text-primary" />
            <div className="flex flex-col gap-2 text-center text-muted-foreground">
              <p>
                Your email has been successfully verified. You will be
                redirected to login in 5 seconds.
              </p>
              <p className="text-sm">
                You can log in using the initial password that was sent with
                your verification link.
              </p>
            </div>
          </div>
        </VerificationStateCard>
      )}

      {isVerificationFailed && (
        <VerificationStateCard
          title="Verification Failed"
          titleClassName="text-destructive"
        >
          <p className="text-center text-muted-foreground">
            {verificationState.message ??
              'Something went wrong. Please try again later.'}
          </p>
        </VerificationStateCard>
      )}
    </div>
  );
}
