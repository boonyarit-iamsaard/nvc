import { MainNav } from '~/common/components/main-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-muted/80 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
      <div className="container flex h-14 items-center">
        <MainNav />
      </div>
    </header>
  );
}
