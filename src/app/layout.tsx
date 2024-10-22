import '~/styles/globals.css';

import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import { NextAuthProvider } from '~/libs/auth/next-auth-provider';
import { cn } from '~/libs/cn';
import { fontSans, fontSerif } from '~/libs/fonts';
import { TRPCReactProvider } from '~/trpc/react';

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
