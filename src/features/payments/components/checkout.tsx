'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { env } from '~/core/configs/app.env';

import { CheckoutForm } from './checkout-form';

const stripe = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function Checkout() {
  const amount = 190000;

  return (
    <Elements
      stripe={stripe}
      // TODO: extract options to a separate file
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            fontFamily: 'Montserrat, system-ui, sans-serif',
            borderRadius: '0.5rem',
            colorPrimary: 'hsl(222.2 47.4% 11.2%)',
            colorBackground: 'hsl(0 0% 100%)',
            colorText: 'hsl(222.2 84% 4.9%)',
            colorDanger: 'hsl(0 84.2% 60.2%)',
            spacingUnit: '0.5rem',
            fontWeightNormal: '400',
            fontLineHeight: '1.5',
            colorTextSecondary: 'hsl(215.4 16.3% 46.9%)',
            colorTextPlaceholder: 'hsl(215.4 16.3% 46.9%)',
            colorIconTab: 'hsl(215.4 16.3% 46.9%)',
          },
          rules: {
            '.Input': {
              padding: '0.75rem 0.5rem',
              backgroundColor: 'var(--colorBackground)',
              borderRadius: 'var(--borderRadius)',
              border: '1px solid hsl(214.3 31.8% 91.4%)',
              boxShadow:
                '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(0, 0, 0, 0.02)',
              fontSize: '0.875rem',
              transition:
                'background 0.15s ease, border 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
            },
            '.Input:focus': {
              border: '1px solid transparent',
              outline: 'none',
              boxShadow:
                '0 0 0 2px hsl(222.2 84% 4.9%), 0 0 0 4px hsl(0 0% 100%)',
            },
            '.Input::placeholder': {
              color: 'hsl(215.4 16.3% 46.9%)',
            },
            '.Input--invalid': {
              borderColor: 'hsl(0 84.2% 60.2%)',
            },
            '.Label': {
              color: 'hsl(222.2 84% 4.9%)',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
            },
            '.Error': {
              color: 'hsl(0 84.2% 60.2%)',
              fontSize: '0.875rem',
              marginTop: '0.25rem',
            },
            '.Tab': {
              padding: '1.5rem',
            },
          },
        },
        fonts: [
          {
            cssSrc:
              'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap',
          },
        ],
        mode: 'payment',
        currency: 'thb',
        amount,
      }}
    >
      <CheckoutForm amount={amount} />
    </Elements>
  );
}
