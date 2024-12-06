import type { HTMLAttributes } from 'react';

import { cn } from '~/common/helpers/cn';

type ContentHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
};

export const ContentHeader = ({
  title,
  description,
  children,
  className,
  ...props
}: ContentHeaderProps) => {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)} {...props}>
      {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
      {description && <p className="text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
};
