'use client';

import { useEffect, useState } from 'react';

import { ContentContainer } from '~/common/components/content-container';
import { RoomTypeFilterForm } from '~/common/components/room-type-filter-form';
import { cn } from '~/common/helpers/cn';

type HeaderState = 'initial' | 'solid' | 'transparent' | 'transitioning';

export default function Page() {
  const HEADER_HEIGHT = 56;

  const [headerState, setHeaderState] = useState<HeaderState>('initial');

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        setHeaderState('transparent');

        return;
      }

      if (
        (headerState === 'initial' || headerState === 'transparent') &&
        currentScrollY >= HEADER_HEIGHT
      ) {
        setHeaderState('transitioning');
        setTimeout(() => {
          setHeaderState('solid');
        }, 300);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerState]);

  return (
    <div className="grid min-h-screen auto-rows-min bg-indigo-50">
      <header
        className={cn(
          'fixed top-0 z-50 col-start-1 row-start-1 flex h-14 w-full items-center bg-indigo-100 transition-all duration-300',
          headerState === 'solid' && 'translate-y-0',
          headerState === 'transitioning' && '-translate-y-full',
          headerState === 'transparent' && 'bg-transparent',
        )}
      >
        <ContentContainer className="flex items-center">
          <p className="text-foreground">Header</p>
        </ContentContainer>
      </header>

      <section className="col-start-1 row-start-1 grid h-[60vh] place-items-center bg-indigo-200">
        <h1 className="text-2xl font-bold">Title</h1>
      </section>

      <section className="z-10 col-start-1 row-start-2 grid h-fit -translate-y-1/2 items-center">
        <ContentContainer size="md" className="border border-indigo-500">
          <div className="bg-background p-6">
            <RoomTypeFilterForm />
          </div>
        </ContentContainer>
      </section>

      <section className="col-start-1 row-start-2 grid h-[1024px]">
        <ContentContainer layout="hero" className="grid py-24">
          <div className="bg-indigo-300">
            <p>Content</p>
          </div>
        </ContentContainer>
      </section>
    </div>
  );
}
