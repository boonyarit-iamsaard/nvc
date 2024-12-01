import type { ReactNode } from 'react';

type PaymentsLayoutProps = {
  children: ReactNode;
};

export default function PaymentsLayout({
  children,
}: Readonly<PaymentsLayoutProps>) {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-muted/60 via-muted/30 to-background" />
      <section className="container relative py-8 md:py-12 lg:py-16">
        {children}
      </section>
    </div>
  );
}
