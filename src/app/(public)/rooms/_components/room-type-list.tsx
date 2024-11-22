'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { setHours, startOfHour } from 'date-fns';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import type { RoomTypeFilter } from '~/features/room-types/room-types.schema';
import { api } from '~/trpc/react';

import { RoomTypeFilterForm } from './room-type-filter-form';
import { RoomTypeItemPlaceholder } from './room-type-item-placeholder';

export function RoomTypeList() {
  const router = useRouter();

  const [filter, setFilter] = useState<RoomTypeFilter>();

  // TODO: implement error states
  const { data: roomTypeList, isLoading } =
    api.roomType.getRoomTypeList.useQuery({ filter });

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

  return (
    <div className="space-y-8">
      <RoomTypeFilterForm onSubmit={setFilter} />

      <ul className="space-y-6">
        {isLoading
          ? Array.from({ length: 3 }).map(() => (
              <RoomTypeItemPlaceholder key={crypto.randomUUID()} />
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
                      <Badge variant="outline">
                        {roomType.rooms.length} available rooms
                      </Badge>
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
                        >
                          Choose this room
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
