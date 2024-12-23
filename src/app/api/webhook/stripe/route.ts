import { NextResponse, type NextRequest } from 'next/server';

import Stripe from 'stripe';

import { env } from '~/core/configs/app.env';
import type { WebhookContextCaller } from '~/core/trpc/stripe';
import { createContext } from '~/core/trpc/stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {});

/**
 * Route segment config
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const context = await createContext(request);
    const event = stripe.webhooks.constructEvent(
      context.payload,
      context.signature,
      env.STRIPE_WEBHOOK_SECRET_KEY,
    );

    // TODO: implement logger and standardize logging messages
    console.log(`Received event: ${event.type}`, event.data.object);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleSessionCompleted(event.data.object, context.caller);
        break;
      case 'customer.created':
        await handleCustomerCreated(event.data.object, context.caller);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
        data: null,
      },
      { status: 200 },
    );
  } catch (error) {
    // TODO: implement logger and standardize logging messages
    console.error('Failed to process webhook', error);

    const status =
      error instanceof Stripe.errors.StripeSignatureVerificationError
        ? 400
        : 500;

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process webhook',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status },
    );
  }
}

async function handleSessionCompleted(
  session: Stripe.Checkout.Session,
  caller: WebhookContextCaller,
) {
  const bookingNumber = session.metadata?.booking_number;
  const amount = session.amount_total;
  const stripeCustomerId = session.customer;
  if (
    !bookingNumber ||
    !amount ||
    !stripeCustomerId ||
    typeof stripeCustomerId !== 'string'
  ) {
    console.error('No booking number or amount found in session metadata');

    return;
  }

  await caller.bookings.updateBookingStatus({
    bookingNumber,
    amount,
    stripeCustomerId,
  });
}

async function handleCustomerCreated(
  customer: Stripe.Customer,
  caller: WebhookContextCaller,
) {
  if (!customer.email) {
    console.error('No email found in customer object');

    return;
  }

  try {
    await caller.users.updateUserStripeCustomerId({
      email: customer.email,
      stripeCustomerId: customer.id,
    });
  } catch (error) {
    console.error('Failed to update user with Stripe customer ID:', error);
  }
}
