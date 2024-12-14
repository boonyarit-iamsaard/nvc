import { ContentContainer } from '~/common/components/content-container';
import { RoomTypeFilterForm } from '~/common/components/room-type-filter-form';
import { env } from '~/core/configs/app.env';

export default async function Page() {
  return (
    <div className="grid h-screen place-items-center bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/40 py-14">
      <ContentContainer className="space-y-14">
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
