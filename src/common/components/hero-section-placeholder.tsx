interface HeroSectionPlaceholderProps {
  title: string;
}

export function HeroSectionPlaceholder({ title }: HeroSectionPlaceholderProps) {
  return (
    <div className="flex h-80 flex-col items-center justify-center space-y-4 bg-gradient-to-b from-muted/60 via-muted/30 to-background">
      <h1 className="font-serif text-4xl font-bold text-foreground">{title}</h1>
    </div>
  );
}
