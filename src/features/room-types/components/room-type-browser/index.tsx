'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { setHours, startOfHour } from 'date-fns';
import { CircleAlert } from 'lucide-react';

import { Badge } from '~/common/components/ui/badge';
import { Button } from '~/common/components/ui/button';
import type { RoomTypeFilter } from '~/features/room-types/room-types.schema';
import { api } from '~/trpc/react';

import { RoomTypeBrowserFilter } from './room-type-browser-filter';
import { RoomTypeBrowserPlaceholder } from './room-type-browser-placeholder';

export function RoomTypeBrowser() {
  const router = useRouter();

  const [filter, setFilter] = useState<RoomTypeFilter>();
  const [overlappedBookings, setOverlappedBookings] = useState<number>(0);

  // TODO: implement error states
  const { data: roomTypeList, isLoading } =
    api.roomTypes.getRoomTypeList.useQuery({ filter });

  function handleChooseRoom(id: string) {
    if (!filter?.checkIn || !filter?.checkOut) {
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
    const overlappedBookings = roomTypeList?.reduce((acc, roomType) => {
      return acc + roomType._count?.rooms;
    }, 0);

    setOverlappedBookings(overlappedBookings ?? 0);

    return () => {
      setOverlappedBookings(0);
    };
  }, [roomTypeList]);

  return (
    <div className="space-y-8">
      <RoomTypeBrowserFilter onSubmit={setFilter} />

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
          : roomTypeList?.map((roomType) => (
              <li
                key={roomType.id}
                className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative aspect-[3/2] w-full bg-border md:aspect-square md:w-1/4"></div>

                  <div className="flex flex-col space-y-4 p-6 md:w-3/4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-lg font-semibold">
                        {roomType.name}
                      </h2>
                      {roomType.rooms.length > 0 && (
                        <Badge variant="outline">
                          {roomType.rooms.length} available rooms
                        </Badge>
                      )}
                    </div>

                    <p>{roomType.description}</p>

                    <div>
                      <Link
                        href="/"
                        className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                      >
                        More Details
                      </Link>
                    </div>

                    <div className="flex flex-1 flex-col justify-end">
                      <div className="flex items-center justify-end gap-4">
                        <Button
                          type="button"
                          onClick={() => handleChooseRoom(roomType.id)}
                          disabled={roomType.rooms.length === 0}
                        >
                          {roomType.rooms.length === 0
                            ? 'No rooms available'
                            : 'Choose Room'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
      </ul>
    </div>
  );
}
