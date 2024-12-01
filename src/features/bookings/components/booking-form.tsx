'use client';

import { Calendar, Clock, CreditCard, Home, Tag, User } from 'lucide-react';

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
      <Card className="flex items-center justify-center border-border p-8">
        <div className="text-lg">No booking details available</div>
      </Card>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Home className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Room Type</span>
              </div>
              <span className="font-medium">{bookingDetails.roomTypeName}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Room Number</span>
              </div>
              <span className="font-medium">{bookingDetails.roomName}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-3">
          <h4 className="font-medium">Stay Duration</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration</span>
              </div>
              <div className="text-lg font-medium">
                {bookingDetails.weekdayCount + bookingDetails.weekendCount}{' '}
                nights
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Check-in</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {formatDisplayDatetime(bookingDetails.checkIn).date}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDisplayDatetime(bookingDetails.checkIn).time}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Check-out</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {formatDisplayDatetime(bookingDetails.checkOut).date}
                </div>
                <div className="text-sm text-muted-foreground">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Base Amount</span>
              </div>
              <span>฿{formatCurrency(bookingDetails.baseAmount)}</span>
            </div>
            {bookingDetails.discountAmount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Discount (
                    {(
                      (bookingDetails.discountAmount /
                        bookingDetails.baseAmount) *
                      100
                    ).toFixed(0)}
                    %)
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="size-4" />
              <span className="font-medium">Total Amount</span>
            </div>
            <span className="text-lg font-medium">
              ฿{formatCurrency(bookingDetails.totalAmount)}
            </span>
          </div>
        </div>
      </CardContent>

      <div className="h-px bg-border" />

      <div className="p-6">
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
