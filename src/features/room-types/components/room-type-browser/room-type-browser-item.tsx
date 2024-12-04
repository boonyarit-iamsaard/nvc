import Link from 'next/link';

import { Image as ImageIcon } from 'lucide-react';

import { Badge } from '~/common/components/ui/badge';
import { Button } from '~/common/components/ui/button';
import type { GetMembershipsResult } from '~/features/memberships/memberships.schema';

import type { GetRoomTypeListResult } from '../../room-types.schema';
import { RoomTypeBrowserPrice } from './room-type-browser-price';

type RoomTypeBrowserItemProps = {
  roomType: GetRoomTypeListResult[number];
  memberships?: GetMembershipsResult;
  hasFilter: boolean;
  onChooseRoom: (id: string) => void;
};

export function RoomTypeBrowserItem({
  roomType,
  memberships,
  hasFilter,
  onChooseRoom,
}: RoomTypeBrowserItemProps) {
  return (
    <li className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col md:flex-row">
        <div className="relative grid aspect-[3/2] w-full place-items-center bg-muted md:aspect-square md:w-1/4">
          <ImageIcon className="size-20 text-border" />
        </div>

        <div className="flex flex-col space-y-4 p-6 md:w-3/4">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <h2 className="order-2 font-serif text-lg font-semibold sm:order-1">
                  {roomType.name}
                </h2>
                {roomType.rooms.length > 0 && (
                  <Badge variant="outline" className="order-1 sm:order-2">
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
            </div>
          </div>

          {memberships && (
            <RoomTypeBrowserPrice
              roomType={roomType}
              memberships={memberships}
            />
          )}

          <div className="flex flex-1 flex-col justify-end">
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                onClick={() => onChooseRoom(roomType.id)}
                disabled={hasFilter && roomType.rooms.length === 0}
                variant={hasFilter ? 'default' : 'secondary'}
              >
                {!hasFilter
                  ? 'Select dates'
                  : roomType.rooms.length === 0
                    ? 'No rooms available'
                    : 'Choose room'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
