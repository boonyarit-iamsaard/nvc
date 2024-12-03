import type { HTMLAttributes } from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '~/common/helpers/cn';

export const contentContainerVariants = cva('container mx-auto', {
  variants: {
    size: {
      default: 'max-w-7xl', // 80rem - 1280px
      sm: 'max-w-lg', // 32rem - 512px
      md: 'max-w-3xl', // 48rem - 768px
      lg: 'max-w-5xl', // 80rem - 1024px
    },
    layout: {
      default: '',
      none: 'py-16 md:py-24 lg:py-32',
      header: 'py-8 md:py-12 lg:py-16',
      hero: 'py-8',
    },
  },
  defaultVariants: {
    size: 'default',
    layout: 'default',
  },
});

export interface ContentContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof contentContainerVariants> {}

export function ContentContainer({
  className,
  size,
  layout,
  ...props
}: ContentContainerProps) {
  return (
    <div
      className={cn(contentContainerVariants({ size, layout }), className)}
      {...props}
    />
  );
}
