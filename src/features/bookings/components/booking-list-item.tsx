'use client';

import Link from 'next/link';

import { format } from 'date-fns';
import { Calendar, CreditCard, Home, Tag } from 'lucide-react';

import { Badge } from '~/common/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { capitalize } from '~/common/helpers/string';

import type { ListBookingsResult } from '../bookings.schema';
import {
  getBookingPaymentStatusVariant,
  getBookingStatusVariant,
} from '../helpers/get-status-color';

type BookingListItemProps = Readonly<{
  booking: ListBookingsResult[number];
}>;

export function BookingListItem({ booking }: BookingListItemProps) {
  return (
    <Link href={`/bookings/${booking.bookingNumber}`}>
      <Card className="overflow-hidden bg-gradient-to-b from-muted/30 to-card transition-colors hover:from-muted/60 hover:to-muted/30">
        <CardHeader className="">
          <CardTitle className="flex flex-col gap-4 text-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Home className="size-5" />
              <span className="whitespace-nowrap">{booking.roomTypeName}</span>
              <Badge variant="outline" className="whitespace-nowrap">
                {booking.roomName}
              </Badge>
              <Badge
                variant="secondary"
                className="whitespace-nowrap font-mono"
              >
                #{booking.bookingNumber}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getBookingStatusVariant(booking.bookingStatus)}>
                <Tag className="mr-1 size-3.5" />
                {capitalize(booking.bookingStatus)}
              </Badge>
              <Badge
                variant={getBookingPaymentStatusVariant(booking.paymentStatus)}
              >
                <CreditCard className="mr-1 size-3.5" />
                {capitalize(booking.paymentStatus)}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm">{format(booking.checkIn, 'PPP')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                ฿{(booking.totalAmount / 100).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
