import Image from 'next/image';

import hero from '~/core/assets/images/hero.webp';

type HeroSectionPlaceholderProps = Readonly<{
  title: string;
}>;

export function HeroSectionPlaceholder({ title }: HeroSectionPlaceholderProps) {
  return (
    <div className="relative">
      <Image
        src={hero}
        alt="background image"
        fill
        priority
        className="object-cover"
        quality={100}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" />
      <div className="relative pt-14">
        <div className="flex h-[35vh] flex-col items-center justify-center space-y-4">
          <h1 className="font-serif text-4xl font-bold text-background">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
