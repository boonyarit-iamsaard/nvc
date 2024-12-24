import { ContentContainer } from '~/common/components/content-container';
import { PageHeader } from '~/common/components/page-header';
import { api, HydrateClient } from '~/core/trpc/server';
import { RoomTypeBrowserWithFilterParams } from '~/features/room-types/components/room-type-browser';

export default async function Page() {
  void api.roomTypes.listRoomTypes.prefetch({});

  return (
    <HydrateClient>
      <PageHeader title="Our Rooms" />
      <ContentContainer className="relative" layout="hero">
        <RoomTypeBrowserWithFilterParams />
      </ContentContainer>
    </HydrateClient>
  );
}
