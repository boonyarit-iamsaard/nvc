import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export function BookingFormPlaceholder() {
  return (
    <div className="container py-12">
      <Card>
        <CardHeader className="border-b border-border bg-muted">
          <CardTitle>Your booking details</CardTitle>
          <CardDescription>
            Please review your booking information before confirming.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Room Information */}
          <div className="space-y-3">
            <h4 className="font-medium">Room Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Number</span>
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
                <span className="text-muted-foreground">Duration</span>
                <Skeleton className="h-7 w-28" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Check-in</span>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Check-out</span>
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
            <h4 className="font-medium text-muted-foreground">Summary</h4>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Rate</span>
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Benefit</span>
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Total */}
          <div>
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <Skeleton className="h-7 w-32" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t border-border pt-6">
          <Skeleton className="h-12 w-40" />
        </CardFooter>
      </Card>
    </div>
  );
}
