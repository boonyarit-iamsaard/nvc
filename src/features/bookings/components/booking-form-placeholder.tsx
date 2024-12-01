'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { Skeleton } from '~/common/components/ui/skeleton';

export function BookingFormPlaceholder() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-b from-muted/30 to-background">
        <CardTitle>Booking Details</CardTitle>
        <CardDescription>
          Please review your booking details before proceeding
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Room Information */}
        <div className="space-y-3">
          <h4 className="font-medium">Room Information</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="size-4" />
                <span className="text-muted-foreground">Room Type</span>
              </div>
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="size-4" />
                <span className="text-muted-foreground">Room Number</span>
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Stay Duration */}
        <div className="space-y-3">
          <h4 className="font-medium">Stay Duration</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="size-4" />
                <span className="text-muted-foreground">Duration</span>
              </div>
              <Skeleton className="h-7 w-28" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="size-4" />
                <span className="text-muted-foreground">Check-in</span>
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="size-4" />
                <span className="text-muted-foreground">Check-out</span>
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Summary */}
        <div className="space-y-3">
          <h4 className="font-medium">Summary</h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="size-4" />
                <span className="text-muted-foreground">Base Amount</span>
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="size-4" />
                <span className="text-muted-foreground">Discount</span>
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Total */}
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="size-4" />
              <span className="font-medium">Total Amount</span>
            </div>
            <Skeleton className="h-7 w-32" />
          </div>
        </div>
      </CardContent>

      <div className="h-px bg-border" />

      <div className="p-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </Card>
  );
}
