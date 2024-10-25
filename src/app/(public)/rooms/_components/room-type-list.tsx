'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { addDays, setHours, startOfHour } from 'date-fns';

import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

export function RoomTypeList() {
  const router = useRouter();

  const [roomTypeList] = api.roomType.list.useSuspenseQuery({});

  function handleChooseRoom(id: string) {
    const today = new Date();
    const checkIn = startOfHour(setHours(addDays(today, 1), 13));
    const checkOut = startOfHour(setHours(addDays(checkIn, 2), 12));

    const params = new URLSearchParams();
    params.set('id', id);
    params.set('check-in', checkIn.toISOString());
    params.set('check-out', checkOut.toISOString());

    const url = `/booking/create?${params.toString()}`;

    router.push(url);
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-6">
        {roomTypeList.map((roomType) => (
          <li
            key={roomType.id}
            className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative aspect-[3/2] w-full bg-border md:aspect-square md:w-1/4"></div>

              <div className="flex flex-col space-y-4 p-6 md:w-3/4">
                <div className="flex justify-between">
                  <h2 className="font-serif text-lg font-semibold">
                    {roomType.name}
                  </h2>
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
