import { api, HydrateClient } from '~/core/trpc/server';
import { RoomTypeBrowser } from '~/features/room-types/components/room-type-browser';

export default async function Page() {
  void api.roomTypes.getRoomTypeList.prefetch({});

  return (
    <HydrateClient>
      <div className="flex h-80 flex-col items-center justify-center space-y-4 bg-muted text-muted-foreground">
        <h1 className="font-serif text-4xl font-bold">Our Rooms</h1>
      </div>
      <div className="container py-8">
        <RoomTypeBrowser />
      </div>
    </HydrateClient>
  );
}
