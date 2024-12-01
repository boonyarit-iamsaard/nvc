import type { BookingPaymentStatus, BookingStatus } from '@prisma/client';
import type { VariantProps } from 'class-variance-authority';

import type { badgeVariants } from '~/common/components/ui/badge';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

const bookingStatusVariant: Record<BookingStatus, BadgeVariant> = {
  CONFIRMED: 'default',
  PENDING: 'secondary',
  CHECKED_IN: 'default',
  CHECKED_OUT: 'default',
  CANCELLED: 'destructive',
  NO_SHOW: 'destructive',
  ON_HOLD: 'secondary',
  EXPIRED: 'destructive',
};

const bookingPaymentStatusVariant: Record<BookingPaymentStatus, BadgeVariant> =
  {
    PAID: 'default',
    PENDING: 'secondary',
    FAILED: 'destructive',
    REFUNDED: 'outline',
    DISPUTED: 'destructive',
    CANCELLED: 'destructive',
  };

export function getBookingStatusVariant(status: BookingStatus) {
  return bookingStatusVariant[status];
}

export function getBookingPaymentStatusVariant(status: BookingPaymentStatus) {
  return bookingPaymentStatusVariant[status];
}
