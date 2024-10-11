import '~/styles/globals.css';

import type { Metadata } from 'next';

import { cn } from '~/libs/cn';
import { fontSans, fontSerif } from '~/libs/fonts';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
  title: 'Naturist Vacation Club',
  description: 'Naturist Vacation Club',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <div
            className={cn(
              'min-h-screen bg-background font-sans antialiased',
              fontSans.variable,
              fontSerif.variable,
            )}
          >
            <div className="relative flex min-h-screen flex-col bg-background">
              {children}
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
