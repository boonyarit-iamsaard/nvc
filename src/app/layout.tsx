import '~/core/styles/globals.css';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { cn } from '~/common/helpers/cn';
import { fontSans, fontSerif } from '~/common/helpers/fonts';
import { NextAuthProvider } from '~/core/auth/providers/next-auth-provider';
import { TRPCReactProvider } from '~/core/trpc/react';

export const metadata: Metadata = {
  title: 'Naturist Vacation Club',
  description: 'Naturist Vacation Club',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontSerif.variable,
        )}
      >
        <div className="relative flex min-h-screen flex-col bg-background">
          <TRPCReactProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
          </TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
