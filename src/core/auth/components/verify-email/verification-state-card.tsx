import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { cn } from '~/libs/cn';

type VerificationStateCardProps = Readonly<{
  title: string;
  titleClassName?: string;
  children: ReactNode;
}>;

export function VerificationStateCard({
  title,
  titleClassName,
  children,
}: VerificationStateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className={cn('text-center text-lg', titleClassName)}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">{children}</CardContent>
    </Card>
  );
}
