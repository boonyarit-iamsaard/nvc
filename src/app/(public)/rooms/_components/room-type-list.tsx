'use client';

import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

export function RoomTypeList() {
  const [roomTypeList] = api.roomType.list.useSuspenseQuery();

  return (
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
                <a className="text-sm text-muted-foreground underline-offset-2 hover:underline">
                  More Details
                </a>
              </div>

              <div className="flex flex-1 flex-col justify-end">
                <div className="flex items-center justify-end gap-4">
                  <Button type="button">Choose this room</Button>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
