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
import { env } from '~/core/configs/app.env';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
      <ContentContainer className="flex h-14 items-center">
        <div className="flex md:hidden">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-[80%] rounded-r-lg rounded-tl-none border-r">
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
