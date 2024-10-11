import { verify } from '@node-rs/argon2';
import type { Gender, Role } from '@prisma/client';
import type { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { loginRequestSchema } from '~/server/api/auth/auth.schema';
import { db } from '~/server/db';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  /**
   * Session object returned from the `session` callback.
   */
  interface Session extends DefaultSession {
    user: {
      email: string;
      image: string | null;
      name: string | null;
      role: Role;
      gender: Gender;
      // ...other properties
    };
    // } & DefaultSession['user'];
  }

  /**
   * User object returned from the `authorize` function.
   */
  interface User extends DefaultUser {
    id: string;
    email: string;
    image: string | null;
    name: string | null;
    role: Role;
    gender: Gender;
    // ...other properties
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWT object returned from the `jwt` callback.
   */
  interface JWT {
    role: Role;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    /**
     * Use an if branch to check for the existence of parameters (apart from token). If they exist,
     * this means that the callback is being invoked for the first time (i.e. the user is being signed in).
     * This is a good place to persist additional data like an access_token in the JWT.
     * Subsequent invocations will only contain the token parameter.
     *
     * @see https://next-auth.js.org/configuration/callbacks#jwt-callback
     */
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Please enter your email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Please enter your password',
        },
      },
      async authorize(credentials) {
        const result = loginRequestSchema.safeParse(credentials);
        if (!result.success) {
          throw new Error('invalid credentials');
        }
        // FIXME: should this be wrapped in a try/catch block to handle both the db error and the
        // non-existent user error?
        const user = await db.user.findUnique({
          where: {
            email: result.data.email,
          },
        });
        if (!user) {
          throw new Error('invalid credentials');
        }

        const hashedPassword = user.hashedPassword;
        if (!hashedPassword) {
          throw new Error('invalid credentials');
        }

        const isValidPassword = await verify(
          hashedPassword,
          result.data.password,
        );
        if (!isValidPassword) {
          throw new Error('invalid credentials');
        }

        const { id, email, name, role, gender, image } = user;
        return {
          id,
          email,
          name,
          role,
          gender,
          image,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
