'use client';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { formatCurrency } from '~/libs/currency';
import { formatDisplayDatetime } from '~/libs/date';

import { useBookingForm } from '../_hooks/use-booking-form';
import { BookingFormPlaceholder } from './booking-form-placeholder';

export function BookingForm() {
  const { bookingDetails, isLoading, isSubmitting, handleSubmit } =
    useBookingForm();

  if (isLoading) {
    return <BookingFormPlaceholder />;
  }

  if (!bookingDetails) {
    return (
      <div className="container py-12">
        <Card className="flex items-center justify-center border-border p-8">
          <div className="text-lg">No booking details available</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="overflow-hidden border-border">
        <CardHeader className="border-b border-border bg-muted">
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>
            Please review your booking details before proceeding
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="space-y-3">
            <h4 className="font-medium">Room Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-medium">
                  {bookingDetails.roomTypeName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Number</span>
                <span className="font-medium">{bookingDetails.roomName}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-3">
            <h4 className="font-medium">Stay Duration</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duration</span>
                <div className="text-lg font-medium">
                  {bookingDetails.weekdayCount + bookingDetails.weekendCount}{' '}
                  nights
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Check-in</span>
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
                <span className="text-muted-foreground">Check-out</span>
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
            <h4 className="font-medium text-muted-foreground">Summary</h4>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Rate</span>
                <span>{formatCurrency(bookingDetails.baseAmount)} THB</span>
              </div>
              {bookingDetails.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Benefit</span>
                  <span className="text-emerald-600">
                    -{formatCurrency(bookingDetails.discountAmount)} THB
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-lg font-medium">
                {formatCurrency(bookingDetails.totalAmount)} THB
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t border-border pt-6">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Book Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
