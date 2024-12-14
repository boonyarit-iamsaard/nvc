'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

import { ContentContainer } from '~/common/components/content-container';
import { RoomTypeFilterForm } from '~/common/components/room-type-filter-form';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/common/components/ui/alert';
import type { DateRangePickerRef } from '~/common/components/ui/date-range-picker';
import {
  withFilterParams,
  type WithFilterParamsProps,
} from '~/common/components/with-filter-params';
import { api } from '~/core/trpc/react';

import { RoomTypeBrowserItem } from './room-type-browser-item';
import { RoomTypeBrowserPlaceholder } from './room-type-browser-placeholder';

function RoomTypeBrowser({ filterParams }: WithFilterParamsProps) {
  const filterRef = useRef<DateRangePickerRef>(null);
  const router = useRouter();
  const utils = api.useUtils();

  const [overlappedBookings, setOverlappedBookings] = useState<number>(0);

  // TODO: implement error states
  const { data: roomTypes, isLoading: isLoadingRoomTypes } =
    api.roomTypes.getRoomTypeList.useQuery({ filter: filterParams });
  const { data: memberships, isLoading: isLoadingMemberships } =
    api.memberships.getMemberships.useQuery();

  const hasFilter = !!filterParams?.checkIn && !!filterParams?.checkOut;
  const isLoading = isLoadingRoomTypes || isLoadingMemberships;

  function handleChooseRoom(id: string) {
    if (!filterParams?.checkIn || !filterParams?.checkOut) {
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

    const params = new URLSearchParams();
    params.set('id', id);
    params.set('check-in', format(filterParams.checkIn, 'yyyy-MM-dd'));
    params.set('check-out', format(filterParams.checkOut, 'yyyy-MM-dd'));

    const url = `/bookings/create?${params.toString()}`;

    router.push(url);
  }

  function handleClear() {
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
      <ContentContainer size="md" className="px-0">
        <RoomTypeFilterForm
          filter={filterParams}
          onClear={handleClear}
          ref={filterRef}
        />
      </ContentContainer>

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

export const RoomTypeBrowserWithFilterParams =
  withFilterParams(RoomTypeBrowser);
