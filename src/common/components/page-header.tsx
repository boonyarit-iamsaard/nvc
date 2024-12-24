import type { HTMLAttributes } from 'react';
import Image from 'next/image';

import { cn } from '~/common/helpers/cn';
import hero from '~/core/assets/images/hero.webp';

type PageHeaderProps = Readonly<
  HTMLAttributes<HTMLDivElement> & {
    title?: string;
  }
>;

export function PageHeader({ className, title, ...props }: PageHeaderProps) {
  return (
    <div className={cn('relative', className)} {...props}>
      <Image
        src={hero}
        alt="background image"
        fill
        priority
        className="object-cover"
        quality={100}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/0" />
      <div className="relative pt-14">
        <div className="flex h-[35vh] flex-col items-center justify-center space-y-4">
          {title ? (
            <h1 className="font-serif text-4xl font-bold text-background">
              {title}
            </h1>
          ) : null}
        </div>
      </div>
    </div>
  );
}
