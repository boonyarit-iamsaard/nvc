'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { setHours, startOfHour } from 'date-fns';
import { CircleAlert } from 'lucide-react';

import type { DateRangePickerRef } from '~/common/components/ui/date-range-picker';
import { api } from '~/core/trpc/react';

import type { RoomTypeFilter } from '../../room-types.schema';
import { RoomTypeBrowserFilter } from './room-type-browser-filter';
import { RoomTypeBrowserItem } from './room-type-browser-item';
import { RoomTypeBrowserPlaceholder } from './room-type-browser-placeholder';

export function RoomTypeBrowser() {
  const router = useRouter();
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
      <RoomTypeBrowserFilter ref={filterRef} onSubmit={setFilter} />

      {overlappedBookings > 0 ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-6 py-4 text-destructive shadow-sm">
          <CircleAlert className="h-4 w-4" />
          <span className="text-sm font-medium">
            You have {overlappedBookings} overlapping bookings for the selected
            dates
          </span>
        </div>
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
                onChooseRoom={handleChooseRoom}
              />
            ))}
      </ul>
    </section>
  );
}
