interface HeroSectionPlaceholderProps {
  title: string;
}

export function HeroSectionPlaceholder({ title }: HeroSectionPlaceholderProps) {
  return (
    <div className="bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground/40 pt-14">
      <div className="flex h-[35vh] flex-col items-center justify-center space-y-4">
        <h1 className="font-serif text-4xl font-bold text-background">
          {title}
        </h1>
      </div>
    </div>
  );
}
