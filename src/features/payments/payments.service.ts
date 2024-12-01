import { Stripe } from 'stripe';

import { env } from '~/core/configs/app.env';

import type { CreatePaymentIntentInput } from './payments.schema';

export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly stripeCurrency: string;

  constructor() {
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
    this.stripeCurrency = env.STRIPE_CURRENCY;
  }

  async createPaymentIntent(input: CreatePaymentIntentInput) {
    const { amount } = input;

    return this.stripe.paymentIntents.create({
      amount,
      currency: this.stripeCurrency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }
}
