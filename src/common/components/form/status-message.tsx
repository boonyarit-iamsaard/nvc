'use client';

import { forwardRef, type HTMLAttributes } from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '~/common/helpers/cn';

export const statusMessageVariants = cva(
  'rounded-md border px-4 py-2 text-sm',
  {
    variants: {
      variant: {
        default: 'border-primary/50 bg-primary/10 text-primary text-center',
        destructive: 'border-destructive/50 bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type StatusMessageProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof statusMessageVariants>;

export const StatusMessage = forwardRef<HTMLDivElement, StatusMessageProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(statusMessageVariants({ variant }), className)}
      {...props}
    />
  ),
);
StatusMessage.displayName = 'StatusMessage';
