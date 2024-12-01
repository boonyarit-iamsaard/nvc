import { HeroSectionPlaceholder } from '~/common/components/hero-section-placeholder';
import { env } from '~/core/configs/app.env';

export default async function Page() {
  return <HeroSectionPlaceholder title={env.NEXT_PUBLIC_APP_NAME} />;
}
