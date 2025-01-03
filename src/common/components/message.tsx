'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

import { Button } from '~/common/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/common/components/ui/card';
import { cn } from '~/common/helpers/cn';

export const messageVariants = cva(
  'rounded-lg border shadow-sm max-w-lg w-full mx-auto',
  {
    variants: {
      variant: {
        success: '',
        error: '',
        warning: '',
        info: '',
        action: '',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export type MessageProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageVariants> & {
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  };

const iconStyles: Record<NonNullable<MessageProps['variant']>, string> = {
  success:
    'text-[hsl(var(--chart-2))] dark:text-[hsl(var(--chart-2))] dark:brightness-90',
  error: 'text-destructive/90',
  warning:
    'text-[hsl(var(--chart-4))] dark:text-[hsl(var(--chart-4))] dark:brightness-90',
  info: 'text-foreground/80',
  action: 'text-foreground/80',
};

const iconVariants: Record<NonNullable<MessageProps['variant']>, ReactNode> = {
  success: <CheckCircle2 className={cn('size-12', iconStyles.success)} />,
  error: <AlertCircle className={cn('size-12', iconStyles.error)} />,
  warning: <AlertCircle className={cn('size-12', iconStyles.warning)} />,
  info: <Info className={cn('size-12', iconStyles.info)} />,
  action: <Info className={cn('size-12', iconStyles.action)} />,
};

export function Message({
  className,
  variant = 'info',
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  children,
  ...props
}: MessageProps) {
  return (
    <Card
      className={cn(
        messageVariants({ variant }),
        'rounded-none border',
        className,
      )}
      {...props}
    >
      <CardHeader className="flex flex-col items-center space-y-3 p-6 text-center">
        {iconVariants[variant ?? 'info']}
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </h3>
        {message && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        )}
      </CardHeader>

      {children && <CardContent>{children}</CardContent>}

      {(onConfirm ?? onCancel) && (
        <CardFooter>
          <div className="grid w-full gap-3 sm:grid-cols-6">
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className={cn(
                  'sm:col-span-2',
                  onConfirm ? 'sm:col-start-2' : 'sm:col-start-3',
                )}
              >
                {cancelLabel ?? 'Cancel'}
              </Button>
            )}
            {onConfirm && (
              <Button
                variant={variant === 'error' ? 'destructive' : 'default'}
                onClick={onConfirm}
                className={cn(
                  'sm:col-span-2',
                  onCancel ? 'sm:col-start-4' : 'sm:col-start-3',
                )}
              >
                {confirmLabel ?? 'Confirm'}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
