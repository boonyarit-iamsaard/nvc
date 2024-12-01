import type { FormEvent } from 'react';
import { useState } from 'react';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { AlertCircle, Loader2 } from 'lucide-react';

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
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { formatCurrency } from '~/common/helpers/currency';
import { env } from '~/core/configs/app.env';
import { api } from '~/core/trpc/react';

type CheckoutFormProps = Readonly<{ amount: number }>;

export function CheckoutForm({ amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);

  const { data, error } = api.payments.createPaymentIntent.useQuery({
    amount,
  });
  const clientSecret = data?.data.clientSecret;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!clientSecret) {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      console.error('submit error: ', submitError);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${env.NEXT_PUBLIC_APP_URL}/payments/success`,
      },
    });
    if (confirmError) {
      console.error('confirm error: ', confirmError);
      return;
    }
  }

  const isLoading =
    !clientSecret || !stripe || !elements || !isPaymentElementReady;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Loading checkout form...
        </p>

        <div className="hidden">
          <PaymentElement onReady={() => setIsPaymentElementReady(true)} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-screen-sm flex-col items-center gap-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
        <Button
          type="button"
          size="lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mx-auto max-w-screen-sm bg-background">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 border-b px-8 py-6">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Payment Details
            </CardTitle>
            <p className="text-sm text-muted-foreground/80">
              Amount to pay: {formatCurrency(amount)}
            </p>
          </div>
          <Icons.Logo className="size-12 text-primary/90" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <PaymentElement />
          <div className="rounded-lg border bg-muted/5 p-4">
            <p className="text-sm text-muted-foreground">
              Your payment information is encrypted and secure.
            </p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button
            type="submit"
            disabled={!stripe || !elements}
            className="w-full font-medium"
            size="lg"
          >
            Pay {formatCurrency(amount)} THB
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
