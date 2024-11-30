import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { cn } from '~/common/helpers/cn';

export type VerifyEmailStateCardProps = Readonly<{
  title: string;
  titleClassName?: string;
  children: ReactNode;
}>;

export function VerifyEmailStateCard({
  title,
  titleClassName,
  children,
}: VerifyEmailStateCardProps) {
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
