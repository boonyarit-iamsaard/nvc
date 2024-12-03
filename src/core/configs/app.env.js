import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const SUPPORTED_TIMEZONES = Intl.supportedValuesOf('timeZone');

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    APP_NAME: z.string().min(1),
    APP_TIMEZONE: z.string().refine((data) => {
      return SUPPORTED_TIMEZONES.includes(data);
    }),
    APP_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    DATABASE_URL: z.string().url(),

    MAIL_HOST: z.string().min(1),
    MAIL_PORT: z.coerce.number().nonnegative(),
    MAIL_USER: z.string().min(1),
    MAIL_PASSWORD: z.string().min(1),
    MAIL_FROM_NAME: z.string().min(1),
    MAIL_FROM_ADDRESS: z.string().email(),

    NEXTAUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),

    EMAIL_VERIFICATION_EXPIRES_IN: z.string(),
    PASSWORD_RESET_EXPIRES_IN: z.string(),

    STRIPE_CURRENCY: z.string().toLowerCase().trim().length(3),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_NAME: z.string(),
    NEXT_PUBLIC_APP_TIMEZONE: z.string().refine((data) => {
      return SUPPORTED_TIMEZONES.includes(data);
    }),
    NEXT_PUBLIC_APP_URL: z.string().url(),

    NEXT_PUBLIC_STRIPE_CURRENCY: z.string().toLowerCase().trim().length(3),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    APP_NAME: process.env.APP_NAME,
    APP_TIMEZONE: process.env.APP_TIMEZONE,
    APP_URL: process.env.APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_TIMEZONE: process.env.NEXT_PUBLIC_APP_TIMEZONE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

    DATABASE_URL: process.env.DATABASE_URL,

    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    EMAIL_VERIFICATION_EXPIRES_IN: process.env.EMAIL_VERIFICATION_EXPIRES_IN,
    PASSWORD_RESET_EXPIRES_IN: process.env.PASSWORD_RESET_EXPIRES_IN,

    STRIPE_CURRENCY: process.env.STRIPE_CURRENCY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET_KEY: process.env.STRIPE_WEBHOOK_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_CURRENCY: process.env.NEXT_PUBLIC_STRIPE_CURRENCY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
