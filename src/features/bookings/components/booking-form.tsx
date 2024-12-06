'use client';

import Link from 'next/link';

import {
  Calendar,
  Clock,
  CreditCard,
  Home,
  Loader2,
  Tag,
  User,
} from 'lucide-react';

import { Message } from '~/common/components/message';
import { Button } from '~/common/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { formatCurrency } from '~/common/helpers/currency';
import { formatDisplayDatetime } from '~/common/helpers/date';

import { useBookingForm } from '../hooks/use-booking-form';
import { BookingFormPlaceholder } from './booking-form-placeholder';

export function BookingForm() {
  const { bookingDetails, isLoading, isSubmitting, handleSubmit } =
    useBookingForm();

  if (isLoading) {
    return <BookingFormPlaceholder />;
  }

  if (!bookingDetails) {
    return (
      <Message
        variant="info"
        title="No Booking Details"
        message="Unable to find your booking details. Would you like to make a new reservation?"
      >
        <div className="flex justify-center">
          <Button asChild size="sm">
            <Link href="/rooms">Find a Room</Link>
          </Button>
        </div>
      </Message>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-b from-muted/30 to-background">
        <CardTitle>Booking Details</CardTitle>
        <CardDescription>
          Please review your booking details before proceeding
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium">Room Information</h4>
          <div className="space-y-2">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-2">
                <Home className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground sm:hidden">
                  Type
                </span>
                <span className="hidden text-muted-foreground sm:inline">
                  Room Type
                </span>
              </div>
              <span className="font-medium">{bookingDetails.roomTypeName}</span>
            </div>
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-2">
                <Tag className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground sm:hidden">
                  No.
                </span>
                <span className="hidden text-muted-foreground sm:inline">
                  Room Number
                </span>
              </div>
              <span className="font-medium">{bookingDetails.roomName}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-3">
          <h4 className="font-medium">Stay Duration</h4>
          <div className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground sm:hidden">
                  Stay
                </span>
                <span className="hidden text-muted-foreground sm:inline">
                  Duration
                </span>
              </div>
              <div className="text-base font-medium sm:text-lg">
                {bookingDetails.weekdayCount + bookingDetails.weekendCount}{' '}
                nights
              </div>
            </div>
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground sm:hidden">
                  In
                </span>
                <span className="hidden text-muted-foreground sm:inline">
                  Check-in
                </span>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-base font-medium sm:text-lg">
                  {formatDisplayDatetime(bookingDetails.checkIn).date}
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">
                  {formatDisplayDatetime(bookingDetails.checkIn).time}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground sm:hidden">
                  Out
                </span>
                <span className="hidden text-muted-foreground sm:inline">
                  Check-out
                </span>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-base font-medium sm:text-lg">
                  {formatDisplayDatetime(bookingDetails.checkOut).date}
                </div>
                <div className="text-xs text-muted-foreground sm:text-sm">
                  {formatDisplayDatetime(bookingDetails.checkOut).time}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-3">
          <h4 className="font-medium">Summary</h4>
          <div className="space-y-2.5">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-2">
                <CreditCard className="size-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground sm:hidden">
                  Base
                </span>
                <span className="hidden text-muted-foreground sm:inline">
                  Base Amount
                </span>
              </div>
              <span>฿{formatCurrency(bookingDetails.baseAmount)}</span>
            </div>
            {bookingDetails.discountAmount > 0 && (
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center space-x-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="hidden text-muted-foreground sm:inline">
                    Discount (
                    {(
                      (bookingDetails.discountAmount /
                        bookingDetails.baseAmount) *
                      100
                    ).toFixed(0)}
                    %)
                  </span>
                  <span className="text-sm text-muted-foreground sm:hidden">
                    Disc.{' '}
                    {(
                      (bookingDetails.discountAmount /
                        bookingDetails.baseAmount) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                </div>
                <span className="text-destructive">
                  -฿{formatCurrency(bookingDetails.discountAmount)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center space-x-2">
              <CreditCard className="size-4" />
              <span className="text-sm font-medium sm:hidden">Total</span>
              <span className="hidden font-medium sm:inline">Total Amount</span>
            </div>
            <span className="text-base font-medium sm:text-lg">
              ฿{formatCurrency(bookingDetails.totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>

      <div className="h-px bg-border" />

      <div className="p-6">
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Book Now'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
