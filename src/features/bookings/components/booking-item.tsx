'use client';

import type { BookingPaymentStatus, BookingStatus } from '@prisma/client';
import { format } from 'date-fns';
import { Calendar, Clock, CreditCard, Home, Tag, User } from 'lucide-react';

import { Badge } from '~/common/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/common/components/ui/card';
import { Separator } from '~/common/components/ui/separator';
import { capitalize } from '~/common/helpers/string';

import type { GetUserBookingListResult } from '../bookings.schema';
import {
  getBookingPaymentStatusVariant,
  getBookingStatusVariant,
} from '../helpers/get-status-color';

type BookingItemAmountInfoProps = Readonly<{
  baseAmount: number;
  discountAmount: number;
  totalAmount: number;
}>;

function BookingItemAmountInfo({
  baseAmount,
  discountAmount,
  totalAmount,
}: BookingItemAmountInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Base Amount:</span>
        <span>฿{(baseAmount / 100).toLocaleString()}</span>
      </div>
      {discountAmount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Discount ({(discountAmount / baseAmount) * 100}%):
          </span>
          <span className="text-destructive">
            -฿{(discountAmount / 100).toLocaleString()}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CreditCard className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Total Amount:</span>
        </div>
        <span className="text-lg font-semibold">
          ฿{(totalAmount / 100).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

type BookingItemCheckInInfoProps = Readonly<{
  checkIn: Date;
}>;

function BookingItemCheckInInfo({ checkIn }: BookingItemCheckInInfoProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <Calendar className="size-4 text-muted-foreground" />
      <span className="font-medium">Check-in:</span>
      <span>{format(checkIn, 'PPP')}</span>
    </div>
  );
}

type BookingItemCheckInTimeInfoProps = Readonly<{
  checkIn: Date;
}>;

function BookingItemCheckInTimeInfo({
  checkIn,
}: BookingItemCheckInTimeInfoProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <Clock className="size-4 text-muted-foreground" />
      <span className="font-medium">Check-in Time:</span>
      <span>{format(checkIn, 'p')}</span>
    </div>
  );
}

type BookingItemCheckOutInfoProps = Readonly<{
  checkOut: Date;
}>;

function BookingItemCheckOutInfo({ checkOut }: BookingItemCheckOutInfoProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <Calendar className="size-4 text-muted-foreground" />
      <span className="font-medium">Check-out:</span>
      <span>{format(checkOut, 'PPP')}</span>
    </div>
  );
}

type BookingItemCheckOutTimeInfoProps = Readonly<{
  checkOut: Date;
}>;

function BookingItemCheckOutTimeInfo({
  checkOut,
}: BookingItemCheckOutTimeInfoProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <Clock className="size-4 text-muted-foreground" />
      <span className="font-medium">Check-out Time:</span>
      <span>{format(checkOut, 'p')}</span>
    </div>
  );
}

type BookingItemGuestInfoProps = Readonly<{
  guestName: string;
  guestMembershipName: string | null;
  guestMembershipNumber: string | null;
}>;

function BookingItemGuestInfo({
  guestName,
  guestMembershipName,
  guestMembershipNumber,
}: BookingItemGuestInfoProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
      <User className="size-4 text-muted-foreground" />
      <span className="font-medium">Guest:</span>
      <span>{guestName}</span>
      {guestMembershipName && guestMembershipNumber && (
        <>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary" className="whitespace-nowrap">
            {guestMembershipName}
          </Badge>
          <span className="text-muted-foreground">{guestMembershipNumber}</span>
        </>
      )}
    </div>
  );
}

type BookingItemRoomInfoProps = Readonly<{
  roomTypeName: string;
  roomName: string;
  bookingNumber: string;
}>;

function BookingItemRoomInfo({
  roomTypeName,
  roomName,
  bookingNumber,
}: BookingItemRoomInfoProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Home className="size-5" />
      <span className="whitespace-nowrap">{roomTypeName}</span>
      <Badge variant="outline" className="whitespace-nowrap">
        {roomName}
      </Badge>
      <Badge variant="secondary" className="whitespace-nowrap font-mono">
        #{bookingNumber}
      </Badge>
    </div>
  );
}

type BookingItemStatusesProps = Readonly<{
  bookingStatus: BookingStatus;
  paymentStatus: BookingPaymentStatus;
}>;

function BookingItemStatuses({
  bookingStatus,
  paymentStatus,
}: BookingItemStatusesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={getBookingStatusVariant(bookingStatus)}>
        <Tag className="mr-1 size-3.5" />
        {capitalize(bookingStatus)}
      </Badge>
      <Badge variant={getBookingPaymentStatusVariant(paymentStatus)}>
        <CreditCard className="mr-1 size-3.5" />
        {capitalize(paymentStatus)}
      </Badge>
    </div>
  );
}

type BookingItemProps = Readonly<{
  booking: Readonly<GetUserBookingListResult[number]>;
}>;

export function BookingItem({ booking }: BookingItemProps) {
  return (
    <Card key={booking.id} className="overflow-hidden">
      <CardHeader className="bg-gradient-to-b from-muted/30 to-background">
        <CardTitle className="flex flex-col gap-4 text-lg sm:flex-row sm:items-center sm:justify-between">
          <BookingItemRoomInfo
            roomTypeName={booking.roomTypeName}
            roomName={booking.roomName}
            bookingNumber={booking.bookingNumber}
          />
          <BookingItemStatuses
            bookingStatus={booking.bookingStatus}
            paymentStatus={booking.paymentStatus}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <BookingItemGuestInfo
          guestName={booking.guestName}
          guestMembershipName={booking.guestMembershipName}
          guestMembershipNumber={booking.guestMembershipNumber}
        />
        <div className="grid gap-6 sm:gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <BookingItemCheckInInfo checkIn={booking.checkIn} />
            <BookingItemCheckInTimeInfo checkIn={booking.checkIn} />
          </div>
          <div className="space-y-4">
            <BookingItemCheckOutInfo checkOut={booking.checkOut} />
            <BookingItemCheckOutTimeInfo checkOut={booking.checkOut} />
          </div>
        </div>
        <Separator className="my-6 sm:my-4" />
        <BookingItemAmountInfo
          baseAmount={booking.baseAmount}
          discountAmount={booking.discountAmount}
          totalAmount={booking.totalAmount}
        />
      </CardContent>
    </Card>
  );
}
