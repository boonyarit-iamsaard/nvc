'use client';

import { useEffect, useState } from 'react';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Menu } from 'lucide-react';

import { ContentContainer } from '~/common/components/content-container';
import { MainNav } from '~/common/components/main-nav';
import { Button } from '~/common/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/common/components/ui/drawer';
import { cn } from '~/common/helpers/cn';
import { env } from '~/core/configs/app.env';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 56);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full bg-transparent transition-colors duration-200',
        isScrolled &&
          'bg-foreground backdrop-blur supports-[backdrop-filter]:bg-foreground/85',
      )}
    >
      <ContentContainer className="flex h-14 items-center">
        <div className="flex md:hidden">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-5 text-background/60 hover:text-background/80" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-[80%] rounded-none border-r">
              <VisuallyHidden.Root asChild>
                <DrawerHeader>
                  <DrawerTitle>
                    {env.NEXT_PUBLIC_APP_NAME} &apos;s Menu
                  </DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                </DrawerHeader>
              </VisuallyHidden.Root>
              <div className="flex flex-col px-4 pb-4">
                <MainNav />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="hidden md:flex md:flex-1">
          <MainNav />
        </div>
      </ContentContainer>
    </header>
  );
}
