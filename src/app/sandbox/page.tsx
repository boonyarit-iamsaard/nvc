'use client';

import { useEffect, useState } from 'react';

import { ContentContainer } from '~/common/components/content-container';
import { RoomTypeFilterForm } from '~/common/components/room-type-filter-form';
import { cn } from '~/common/helpers/cn';

export default function Page() {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const [isHeaderSliding, setIsHeaderSliding] = useState(false);
  const HEADER_HEIGHT = 56;

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        setIsHeaderFixed(false);
        setIsHeaderSliding(false);

        return;
      }

      if (!isHeaderFixed && currentScrollY >= HEADER_HEIGHT) {
        setIsHeaderSliding(true);
        setTimeout(() => {
          setIsHeaderFixed(true);
          setIsHeaderSliding(false);
        }, 300);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeaderFixed]);

  return (
    <div className="grid min-h-screen auto-rows-min bg-indigo-50">
      <header
        className={cn(
          'z-50 col-start-1 row-start-1 h-14 bg-indigo-100 transition-all duration-300',
          isHeaderFixed && 'fixed top-0 w-full translate-y-0',
          isHeaderSliding && '-translate-y-full',
        )}
      ></header>

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
