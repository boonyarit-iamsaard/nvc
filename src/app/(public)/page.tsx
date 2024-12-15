import Image from 'next/image';

import { ContentContainer } from '~/common/components/content-container';
import { RoomTypeFilterForm } from '~/common/components/room-type-filter-form';
import hero from '~/core/assets/images/hero.webp';
import { env } from '~/core/configs/app.env';

export default async function Page() {
  return (
    <div className="relative grid h-screen place-items-center py-14">
      <Image
        src={hero}
        alt="background image"
        fill
        priority
        className="object-cover"
        quality={100}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" />
      <ContentContainer className="relative space-y-14">
        <div className="space-y-4 text-center text-background">
          <p className="text-xl font-semibold">Welcome</p>
          <h1 className="font-serif text-2xl font-bold sm:text-4xl">
            {env.NEXT_PUBLIC_APP_NAME}
          </h1>
        </div>
        <ContentContainer size="md" className="px-0">
          <RoomTypeFilterForm />
        </ContentContainer>
      </ContentContainer>
    </div>
  );
}
