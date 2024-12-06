'use client';

import Link from 'next/link';

import { format } from 'date-fns';
import {
  Calendar,
  ChevronLeft,
  Clock,
  CreditCard,
  Home,
  Tag,
  User,
} from 'lucide-react';

import { LoadingSpinner } from '~/common/components/loading-spinner';
import { Message } from '~/common/components/message';
import { Badge } from '~/common/components/ui/badge';
import { Button } from '~/common/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { Separator } from '~/common/components/ui/separator';
import { capitalize } from '~/common/helpers/string';
import { api } from '~/core/trpc/react';

import {
  getBookingPaymentStatusVariant,
  getBookingStatusVariant,
} from '../helpers/get-status-color';

type BookingDetailsProps = Readonly<{
  bookingNumber: string;
}>;

export function BookingDetails({ bookingNumber }: BookingDetailsProps) {
  const {
    data: booking,
    isLoading,
    error,
  } = api.bookings.getBooking.useQuery({
    bookingNumber,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Message
        variant="error"
        title="Unable to Load Booking Details"
        message="We encountered an error while loading your booking information. This could be due to a network issue or the booking may be temporarily unavailable."
      >
        <div className="flex justify-center">
          <Button asChild size="sm">
            <Link href="/bookings">View Booking</Link>
          </Button>
        </div>
      </Message>
    );
  }

  if (booking) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link href="/bookings">
              <ChevronLeft className="size-4" />
              <span className="sr-only">Back to bookings</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            Booking #{booking.bookingNumber}
          </h1>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-b from-muted/30 to-background">
            <CardTitle className="flex flex-col gap-4 text-lg sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Home className="size-5" />
                <span className="whitespace-nowrap">
                  {booking.roomTypeName}
                </span>
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
                  variant={getBookingPaymentStatusVariant(
                    booking.paymentStatus,
                  )}
                >
                  <CreditCard className="mr-1 size-3.5" />
                  {capitalize(booking.paymentStatus)}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <User className="size-4 text-muted-foreground" />
              <span className="font-medium">Guest:</span>
              <span>{booking.guestName}</span>
              {booking.guestMembershipName && booking.guestMembershipNumber && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {booking.guestMembershipName}
                  </Badge>
                  <span className="text-muted-foreground">
                    {booking.guestMembershipNumber}
                  </span>
                </>
              )}
            </div>

            <div className="grid gap-6 sm:gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="font-medium">Check-in:</span>
                  <span>{format(booking.checkIn, 'PPP')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="font-medium">Check-in Time:</span>
                  <span>{format(booking.checkIn, 'p')}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="font-medium">Check-out:</span>
                  <span>{format(booking.checkOut, 'PPP')}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="font-medium">Check-out Time:</span>
                  <span>{format(booking.checkOut, 'p')}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6 sm:my-4" />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Base Amount:</span>
                <span>฿{(booking.baseAmount / 100).toLocaleString()}</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount (
                    {(booking.discountAmount / booking.baseAmount) * 100}%):
                  </span>
                  <span className="text-destructive">
                    -฿{(booking.discountAmount / 100).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Amount:</span>
                </div>
                <span className="text-lg font-semibold">
                  ฿{(booking.totalAmount / 100).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Message
      variant="error"
      title="Booking Not Found"
      message="We couldn't find the booking with the provided booking number. Please check the booking number and try again."
    >
      <div className="flex justify-center">
        <Button asChild size="sm">
          <Link href="/bookings">View Booking</Link>
        </Button>
      </div>
    </Message>
  );
}
