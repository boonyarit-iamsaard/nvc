import { NextResponse, type NextRequest } from 'next/server';

import Stripe from 'stripe';

import { env } from '~/core/configs/app.env';
import type { WebhookContextCaller } from '~/core/trpc/stripe';
import { createContext } from '~/core/trpc/stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {});

const handler = async (req: NextRequest) => {
  try {
    const context = await createContext(req);

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
      {
        status: 200,
      },
    );
  } catch (error) {
    // TODO: implement logger and standardize logging messages
    console.error('Failed to process webhook', error);

    // TODO: improve error response
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        data: null,
      },
      {
        status: 400,
      },
    );
  }
};

export const POST = handler;

async function handleSessionCompleted(
  session: Stripe.Checkout.Session,
  caller: WebhookContextCaller,
) {
  const bookingNumber = session.metadata?.booking_number;
  if (!bookingNumber) {
    console.error('No booking number found in session metadata');

    return;
  }

  await caller.bookings.markBookingAsPaid({
    bookingNumber,
  });
}

async function handleCustomerCreated(
  _customer: Stripe.Customer,
  _caller: WebhookContextCaller,
) {
  console.log('handle customer created');
  // TODO: set customer id to user
}
