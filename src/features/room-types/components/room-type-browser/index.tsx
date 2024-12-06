'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { setHours, startOfHour } from 'date-fns';
import { AlertCircle } from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/common/components/ui/alert';
import type { DateRangePickerRef } from '~/common/components/ui/date-range-picker';
import { api } from '~/core/trpc/react';

import type { RoomTypeFilter } from '../../room-types.schema';
import { RoomTypeBrowserFilter } from './room-type-browser-filter';
import { RoomTypeBrowserItem } from './room-type-browser-item';
import { RoomTypeBrowserPlaceholder } from './room-type-browser-placeholder';

export function RoomTypeBrowser() {
  const router = useRouter();
  const utils = api.useUtils();
  const filterRef = useRef<DateRangePickerRef>(null);

  const [filter, setFilter] = useState<RoomTypeFilter>();
  const [overlappedBookings, setOverlappedBookings] = useState<number>(0);

  const hasFilter = !!filter?.checkIn && !!filter?.checkOut;

  // TODO: implement error states
  const { data: roomTypes, isLoading: isLoadingRoomTypes } =
    api.roomTypes.getRoomTypeList.useQuery({ filter });
  const { data: memberships, isLoading: isLoadingMemberships } =
    api.memberships.getMemberships.useQuery();

  const isLoading = isLoadingRoomTypes || isLoadingMemberships;

  function handleChooseRoom(id: string) {
    if (!filter?.checkIn || !filter?.checkOut) {
      filterRef.current?.scrollIntoView();

      /**
       * Defer the focus and open calendar to the next tick to ensure that the
       * calendar is visible when the button is clicked.
       */
      setTimeout(() => {
        filterRef.current?.focus();
        filterRef.current?.openCalendar();
      }, 500);

      return;
    }

    const checkIn = startOfHour(setHours(filter.checkIn, 13));
    const checkOut = startOfHour(setHours(filter.checkOut, 12));

    const params = new URLSearchParams();
    params.set('id', id);
    params.set('check-in', checkIn.toISOString());
    params.set('check-out', checkOut.toISOString());

    const url = `/bookings/create?${params.toString()}`;

    router.push(url);
  }

  function handleClear() {
    setFilter(undefined);
    setOverlappedBookings(0);
    void utils.roomTypes.getRoomTypeList.reset();
    void utils.memberships.getMemberships.reset();
  }

  useEffect(() => {
    const overlappedBookings = roomTypes?.reduce((acc, roomType) => {
      return acc + roomType._count?.rooms;
    }, 0);

    setOverlappedBookings(overlappedBookings ?? 0);

    return () => {
      setOverlappedBookings(0);
    };
  }, [roomTypes]);

  return (
    <section className="space-y-8">
      <RoomTypeBrowserFilter
        ref={filterRef}
        onSubmit={setFilter}
        onClear={handleClear}
      />

      {overlappedBookings > 0 ? (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="size-4" />
          <AlertTitle>Overlapping Bookings</AlertTitle>
          <AlertDescription>
            You have {overlappedBookings} overlapping bookings for the selected
            dates
          </AlertDescription>
        </Alert>
      ) : null}

      <ul className="space-y-6">
        {isLoading
          ? Array.from({ length: 3 }).map(() => (
              <RoomTypeBrowserPlaceholder key={crypto.randomUUID()} />
            ))
          : roomTypes?.map((roomType) => (
              <RoomTypeBrowserItem
                key={roomType.id}
                roomType={roomType}
                memberships={memberships}
                hasFilter={hasFilter}
                isLoading={isLoading}
                onChooseRoom={handleChooseRoom}
              />
            ))}
      </ul>
    </section>
  );
}
