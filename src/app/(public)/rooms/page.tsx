import { ContentContainer } from '~/common/components/content-container';
import { HeroSectionPlaceholder } from '~/common/components/hero-section-placeholder';
import { api, HydrateClient } from '~/core/trpc/server';
import { RoomTypeBrowser } from '~/features/room-types/components/room-type-browser';

export default async function Page() {
  void api.roomTypes.getRoomTypeList.prefetch({});

  return (
    <HydrateClient>
      <HeroSectionPlaceholder title="Our Rooms" />
      <ContentContainer className="relative" layout="header">
        <RoomTypeBrowser />
      </ContentContainer>
    </HydrateClient>
  );
}
