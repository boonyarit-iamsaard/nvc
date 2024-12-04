import { format } from 'date-fns';
import { Stripe } from 'stripe';

import { env } from '~/core/configs/app.env';

import type { CreateCheckoutSessionInput } from './payments.schema';

export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly stripeCurrency: string;

  constructor() {
    // TODO: specify stripe version
    this.stripe = new Stripe(env.STRIPE_SECRET_KEY);
    this.stripeCurrency = env.STRIPE_CURRENCY;
  }

  async createCheckoutSession(input: CreateCheckoutSessionInput) {
    const {
      bookingNumber,
      checkIn,
      checkOut,
      guestName,
      guestEmail,
      stripeCustomerId,
      roomName,
      roomTypeName,
      weekdayCount,
      weekendCount,
      totalAmount,
    } = input;

    const customer = await this.retrieveOrCreateCustomer(
      guestEmail,
      guestName,
      stripeCustomerId,
    );

    return this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: this.stripeCurrency,
            product_data: {
              name: `${roomTypeName} (${roomName})`,
              description: `${format(checkIn, 'PPP')} - ${format(checkOut, 'PPP')} (${weekdayCount + weekendCount} nights)`,
              metadata: {
                booking_number: bookingNumber,
              },
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      customer: customer.id,
      payment_method_types: ['card', 'promptpay'],
      metadata: {
        booking_number: bookingNumber,
      },
      mode: 'payment',
      success_url: `${env.APP_URL}/payments/success?booking-number=${bookingNumber}`,
      cancel_url: `${env.APP_URL}/payments/cancel`,
    });
  }

  private async retrieveOrCreateCustomer(
    email: string,
    name: string,
    customerId?: string | null,
  ) {
    if (customerId) {
      try {
        const customer = await this.stripe.customers.retrieve(customerId);
        if (customer.deleted) {
          throw new Error('Customer was deleted');
        }

        return customer;
      } catch (error) {
        console.error('Error retrieving customer:', error);

        return this.stripe.customers.create({ email, name });
      }
    }

    return this.stripe.customers.create({ email, name });
  }
}
