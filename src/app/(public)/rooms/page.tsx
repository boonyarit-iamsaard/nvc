import { api, HydrateClient } from '~/trpc/server';

import { RoomTypeList } from './_components/room-type-list';

export default async function Page() {
  void api.roomType.list.prefetch();

  return (
    <HydrateClient>
      <div className="flex h-80 flex-col items-center justify-center space-y-4 bg-muted text-muted-foreground">
        <h1 className="font-serif text-4xl font-bold">Our Rooms</h1>
      </div>
      <div className="container py-8">
        <RoomTypeList />
      </div>
    </HydrateClient>
  );
}
